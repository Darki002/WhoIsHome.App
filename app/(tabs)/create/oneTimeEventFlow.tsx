import {WihFlow, WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import { WihText, WihTitle } from "@/components/WihText";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import WihView from "@/components/WihView";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import { WihResponse } from "@/components/api/WihApi";
import Toast from "react-native-root-toast";
import { WihTextInput } from "@/components/input/WihInput";
import { WihDateInput, WihTimeInput } from "@/components/input/WihDateTimeInput";
import { formatDate, formatTime } from "@/components/helper/datetimehelper";
import {OneTimeEvent, OneTimeEventDto, PresenceType, PresenceTypes} from "@/constants/WihTypes";
import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";

const defaultOneTimeEvent: OneTimeEvent = {
    Title: "",
    Date: new Date(),
    StateTime: new Date(),
    EndTime: new Date(),
    PresenceType: "Unknown",
    DinnerTime: null,
};

export default function OneTimeEventFlow() {
    const router = useRouter();

    const onCancel = useCallback(() => router.replace("/(tabs)/create"), []);

    const onResponse = useCallback((response: WihResponse<{}> | null) => {
        if (!response || response.hasError) {
            console.error(response?.error ?? "Unknown Error");
            Toast.show('Failed to create Event', {
                duration: Toast.durations.SHORT,
            });
        }
        router.replace("/(tabs)");
    }, []);

    const callWihApi = useWihApiCallable({
        endpoint: "oneTimeEvent",
        method: "POST",
        onResponse
    });

    const onFinish = (state: OneTimeEvent) => {
        const body: OneTimeEventDto = {
            Title: state.Title!,
            Date: formatDate(state.Date!),
            StateTime: formatTime(state.StateTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body);
    }
    return <WihFlow<OneTimeEvent> initValue={defaultOneTimeEvent} onFinish={onFinish} onCancel={onCancel} steps={components} />
}

const titleStep : WihFlowStep<OneTimeEvent> = {
    validate: (state: OneTimeEvent) => !!state.Title, /* TODO: check conditions for Title like max and min length */
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<OneTimeEvent>) => (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                onChangeText={(title) => setState({Title: title})}/>
            {isInvalid && <WihText style={{color: "red"}}>Title must be between 5 - 10 characters</WihText> }
        </WihView>
    )
}

const dateStep : WihFlowStep<OneTimeEvent> = {
    validate: (state: OneTimeEvent) => !!state.Date && !!state.StateTime && !!state.EndTime,
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<OneTimeEvent>) => (
        <WihView center="full">
            <WihTitle>Event Date & Time</WihTitle>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput
                    value={state.Date}
                    onChange={(date) => setState({Date: date})}/>
            </WihView>
            {isInvalid && !state.Date && <WihText style={{color: "red"}}>Date is required</WihText> }

            <WihView flex="row">
                <WihText>Start:</WihText>
                <WihTimeInput
                    value={state.StateTime}
                    onChange={(time) => setState({StateTime: time})}/>
            </WihView>
            {isInvalid && !state.StateTime && <WihText style={{color: "red"}}>StateTime is required</WihText> }

            <WihView flex="row">
                <WihText>End:</WihText>
                <WihTimeInput
                    value={state.EndTime}
                    onChange={(time) => setState({EndTime: time})}/>
            </WihView>
            {isInvalid && !state.EndTime && <WihText style={{color: "red"}}>EndTime is required</WihText> }
        </WihView>
    )
}

const options : Array<WihOption<PresenceType>> = [
    {value: "Unknown", display: "Unknown"},
    {value: "Late", display: "Late"},
    {value: "NotPresent", display: "NotPresent"}
]

const dinnerTimeStep : WihFlowStep<OneTimeEvent> = {
    validate: (state: OneTimeEvent) => !!state.DinnerTime && state.PresenceType !== null,
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<OneTimeEvent>) => (
        <WihView center="full">
            <WihTitle>Dinner Time?</WihTitle>
            
            <WihSingleChoice<PresenceType>
                value={"Unknown"}
                options={options}
                onChange={(c : PresenceType | null) => setState({PresenceType: c ?? undefined})} />
            
            {isInvalid && state.PresenceType === null && !state.EndTime && <WihText style={{color: "red"}}>PresenceType is required</WihText> }
            <WihTimeInput
                value={state.DinnerTime ?? undefined}
                onChange={(time) => setState({DinnerTime: time})}
                disabled={state.PresenceType !== "Late"}/>
            {isInvalid && !state.DinnerTime && !state.EndTime && <WihText style={{color: "red"}}>DinnerTime is required</WihText> }
        </WihView>
    )
}

const summaryStep : WihFlowStep<OneTimeEvent> = {
    validate: (_: OneTimeEvent) => true,
    component: ({ state }: WihFlowComponentProps<OneTimeEvent>) => (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    )
}

const components : Array<WihFlowStep<OneTimeEvent>> = [
    titleStep,
    dateStep,
    dinnerTimeStep,
    summaryStep
];