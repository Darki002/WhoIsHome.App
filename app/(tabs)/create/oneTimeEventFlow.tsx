import {useWihFlow, WihFlowComponent} from "@/hooks/useWihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import {Time} from "lightningcss";
import {useRouter} from "expo-router";
import React from "react";
import WihView from "@/components/WihView";
import {wihFetch} from "@/components/api/WihApi";
import {useSession} from "@/components/auth/context";
import useWihApi from "@/hooks/wihApi/useWihApi";

interface OneTimeEvent {
    Title?: string;
    Date?: Date;
    StateTime?: Time;
    EndTime?: Time;
    // TODO: what else needs the API?
}

export default function OneTimeEventFlow() {
    const router = useRouter();
    const [state, flow] = useWihFlow<OneTimeEvent>({
        initValue: {},
        onFinish,
        onCancel: () => router.replace("/(tabs)/create"),
        components: [
            firstStep,
            summaryStep
        ]
    });

    function onFinish(){
        // TODO: sent to API
        router.replace("/(tabs)");
    }

    if(!flow) {
        return <WihTitle>Oops, Error</WihTitle>
    }

    return flow;
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