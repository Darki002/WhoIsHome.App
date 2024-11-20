import {useWihFlow, WihFlowComponent} from "@/hooks/useWihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import {Time} from "lightningcss";
import {useRouter} from "expo-router";
import React from "react";
import WihView from "@/components/WihView";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/components/api/WihApi";
import Toast from "react-native-root-toast";
import {WihTextInput} from "@/components/input/WihInput";

interface OneTimeEventDto {
    Title?: string;
    Date?: Date;
    StateTime?: Time;
    EndTime?: Time;
    PresenceType?: "Unknown" | "Default" | "Late" | "NotPresent";
    DinnerTime?: Time | null;
}

export default function OneTimeEventFlow() {
    const router = useRouter();

    const callWihApi = useWihApiCallable({
        endpoint: "oneTimeEvent",
        method: "POST",
        onResponse
    });

    const [state, flow] = useWihFlow<OneTimeEventDto>({
        initValue: {},
        onFinish: () => callWihApi(state),
        onCancel: () => router.replace("/(tabs)/create"),
        components: [
            titleStep,
            dateStep,
            presenceStep,
            dinnerTimeStep,
            summaryStep
        ]
    });

    function onResponse(response : WihResponse<{}> | null){
        if(!response || response.hasError){
            console.error(response?.error);
            Toast.show('Failed to create Event', {
                duration: Toast.durations.SHORT,
            });
        }
        router.replace("/(tabs)");
    }

    return flow ? flow : <WihTitle>Oops, Error</WihTitle>;
}

function titleStep({state, setState} : WihFlowComponent<OneTimeEventDto>){
    return (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                onChangeText={(title) => setState({Title: title})} />
        </WihView>
    )
}

function dateStep({state, setState} : WihFlowComponent<OneTimeEventDto>){
    return (
        <WihView center="full">
            <WihTitle>Event Date & Time</WihTitle>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput
                    value={state.Date}
                    onChangeText={(date) => setState({Date: date})} />
            </WihView>

            <WihView flex="row">
                <WihText>Start:</WihText>
                <WihTimeInput
                    value={state.StateTime}
                    onChangeText={(time) => setState({StateTime: time})} />
            </WihView>

            <WihView flex="row">
                <WihText>End:</WihText>
                <WihTimeInput
                    value={state.EndTime}
                    onChangeText={(time) => setState({EndTime: time})} />
            </WihView>
        </WihView>
    )
}

function presenceStep({state, setState} : WihFlowComponent<OneTimeEventDto>){
    // TODO: Single choice for presence
    return(
        <></>
    )
}

function dinnerTimeStep({state, setState} : WihFlowComponent<OneTimeEventDto>){
    return (
        <WihView center="full">
            <WihTitle>Dinner Time?</WihTitle>
            <WihTimeInput
                value={state.DinnerTime}
                onChangeText={(time) => setState({DinnerTime: time})} />
        </WihView>
    )
}

function summaryStep({state} : WihFlowComponent<OneTimeEventDto>){
    return (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    );
}