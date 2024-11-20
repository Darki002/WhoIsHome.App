import {useWihFlow, WihFlowComponent} from "@/hooks/useWihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import {Time} from "lightningcss";
import {useRouter} from "expo-router";
import React from "react";
import WihView from "@/components/WihView";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/components/api/WihApi";
import Toast from "react-native-root-toast";

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
            firstStep,
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

function firstStep({} : WihFlowComponent<OneTimeEventDto>){
    return <WihTitle>Hi</WihTitle>
}

function summaryStep({state} : WihFlowComponent<OneTimeEventDto>){
    return (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    );
}