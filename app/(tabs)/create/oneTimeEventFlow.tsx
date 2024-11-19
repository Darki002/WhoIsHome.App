import {useWihFlow, WihFlowComponent} from "@/hooks/useWihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import {Time} from "lightningcss";
import {useRouter} from "expo-router";
import React from "react";
import WihView from "@/components/WihView";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";

interface OneTimeEvent {
    Title?: string;
    Date?: Date;
    StateTime?: Time;
    EndTime?: Time;
    // TODO: what else needs the API?
}

export default function OneTimeEventFlow() {
    const router = useRouter();

    const callWihApi = useWihApiCallable<{}>({
        endpoint: "oneTimeEvent",
        method: "POST",
        onResponse: (response) => router.replace("/(tabs)") // TODO: check response for status code
    });

    const [state, flow] = useWihFlow<OneTimeEvent>({
        initValue: {},
        onFinish: () => callWihApi(state),
        onCancel: () => router.replace("/(tabs)/create"),
        components: [
            firstStep,
            summaryStep
        ]
    });

    return !flow ? <WihTitle>Oops, Error</WihTitle> : flow;
}

function firstStep({} : WihFlowComponent<OneTimeEvent>){
    return <WihTitle>Hi</WihTitle>
}

function summaryStep({state} : WihFlowComponent<OneTimeEvent>){
    return (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    );
}