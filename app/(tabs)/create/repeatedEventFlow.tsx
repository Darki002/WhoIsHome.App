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
import {PresenceType, RepeatedEvent, RepeatedEventDto} from "@/constants/WihTypes";
import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";

const defaultOneTimeEvent: RepeatedEvent = {
    Title: "",
    FirstOccurance: undefined,
    LastOccurance: undefined,
    StateTime: new Date(),
    EndTime: new Date(),
    PresenceType: "Unknown",
    DinnerTime: null,
};

export default function RepeatedEventFlow() {
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
        endpoint: "RepeatedEvent",
        method: "POST",
        onResponse
    });

    const onFinish = (state: RepeatedEvent) => {
        const body: RepeatedEventDto = {
            Title: state.Title!,
            FirstOccurance: formatDate(state.FirstOccurance!),
            LastOccurance: formatDate(state.LastOccurance!),
            StateTime: formatTime(state.StateTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body);
    }
    return <WihFlow<RepeatedEvent> initValue={defaultOneTimeEvent} onFinish={onFinish} onCancel={onCancel} steps={components} />
}

const titleStep : WihFlowStep<RepeatedEvent> = {
    validate: (state: RepeatedEvent) => !!state.Title, /* TODO: check conditions for Title like max and min length */
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<RepeatedEvent>) => (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                onChangeText={(title) => setState({Title: title})}/>
            {isInvalid && <WihText style={{color: "red"}}>Title must be between 5 - 10 characters</WihText> }
        </WihView>
    )
}

const dateStep : WihFlowStep<RepeatedEvent> = {
    validate: (state: RepeatedEvent) => !!state.FirstOccurance && !!state.LastOccurance && !!state.StateTime && !!state.EndTime,
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<RepeatedEvent>) => (
        <WihView center="full">
            <WihTitle>Event Date & Time</WihTitle>

            <WihView flex="row">
                <WihText>First Occurance:</WihText>
                <WihDateInput
                    value={state.FirstOccurance}
                    onChange={(date) => setState({FirstOccurance: date})}/>
            </WihView>
            {isInvalid && !state.FirstOccurance && <WihText style={{color: "red"}}>FirstOccurance is required</WihText> }

            <WihView flex="row">
                <WihText>Last Occurance:</WihText>
                <WihDateInput
                    value={state.LastOccurance}
                    onChange={(date) => setState({LastOccurance: date})}/>
            </WihView>
            {isInvalid && !state.LastOccurance && <WihText style={{color: "red"}}>LastOccurance is required</WihText> }

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

const dinnerTimeStep : WihFlowStep<RepeatedEvent> = {
    validate: (state: RepeatedEvent) => !!state.DinnerTime && state.PresenceType !== null,
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<RepeatedEvent>) => (
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

const summaryStep : WihFlowStep<RepeatedEvent> = {
    validate: (_: RepeatedEvent) => true,
    component: ({ state }: WihFlowComponentProps<RepeatedEvent>) => (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    )
}

const components : Array<WihFlowStep<RepeatedEvent>> = [
    titleStep,
    dateStep,
    dinnerTimeStep,
    summaryStep
];