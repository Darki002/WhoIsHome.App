import {WihFlow, WihFlowComponent} from "@/components/wihFlow/wihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import {useRouter} from "expo-router";
import React, {useCallback} from "react";
import WihView from "@/components/WihView";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/components/api/WihApi";
import Toast from "react-native-root-toast";
import {WihTextInput} from "@/components/input/WihInput";
import {WihDateInput, WihTimeInput} from "@/components/input/WihDateTimeInput";

interface OneTimeEvent {
    Title?: string;
    Date?: Date;
    StateTime?: Date;
    EndTime?: Date;
    PresenceType?: "Unknown" | "Default" | "Late" | "NotPresent";
    DinnerTime?: Date | null;
}

interface OneTimeEventDto {
    Title: string;
    Date: string;
    StateTime: string;
    EndTime: string;
    PresenceType: "Unknown" | "Default" | "Late" | "NotPresent";
    DinnerTime: string | null;
}

const components = [
    titleStep,
    dateStep,
    presenceStep,
    dinnerTimeStep,
    summaryStep
];

export default function OneTimeEventFlow() {
    const router = useRouter();

    const onCancel = useCallback(() => router.replace("/(tabs)/create"), []);

    const onResponse = useCallback((response : WihResponse<{}> | null) => {
        if(!response || response.hasError){
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
        const body : OneTimeEventDto = {
            Title: state.Title!,
            Date: state.Date!.toDateString(),
            StateTime: state.StateTime!.toTimeString(),
            EndTime: state.EndTime!.toTimeString(),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime?.toTimeString() ?? null
        }
        callWihApi(body);
    }

    return <WihFlow<OneTimeEvent> onFinish={onFinish} onCancel={onCancel} components={components} />
}

function titleStep({state, setState} : WihFlowComponent<OneTimeEvent>){
    return (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                onChangeText={(title) => setState({Title: title})} />
        </WihView>
    )
}

function dateStep({state, setState} : WihFlowComponent<OneTimeEvent>){
    return (
        <WihView center="full">
            <WihTitle>Event Date & Time</WihTitle>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput
                    value={state.Date}
                    onChange={(date) => setState({Date: date})} />
            </WihView>

            <WihView flex="row">
                <WihText>Start:</WihText>
                <WihTimeInput
                    value={state.StateTime}
                    onChange={(time) => setState({StateTime: time})} />
            </WihView>

            <WihView flex="row">
                <WihText>End:</WihText>
                <WihTimeInput
                    value={state.EndTime}
                    onChange={(time) => setState({EndTime: time})} />
            </WihView>
        </WihView>
    )
}

function presenceStep({state, setState} : WihFlowComponent<OneTimeEvent>){
    // TODO: Single choice for presence
    return(
        <></>
    )
}

function dinnerTimeStep({state, setState} : WihFlowComponent<OneTimeEvent>){
    return (
        <WihView center="full">
            <WihTitle>Dinner Time?</WihTitle>
            <WihTimeInput
                value={state.DinnerTime ?? undefined}
                onChange={(time) => setState({DinnerTime: time})} />
        </WihView>
    )
}

function summaryStep({state} : WihFlowComponent<OneTimeEvent>){
    return (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    );
}