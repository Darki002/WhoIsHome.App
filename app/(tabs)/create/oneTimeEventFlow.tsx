import { WihFlow, WihFlowComponentProps } from "@/components/wihFlow/wihFlow";
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
import { OneTimeEvent, OneTimeEventDto } from "@/constants/WihTypes";

const components = [
    titleStep,
    dateStep,
    dinnerTimeStep,
    summaryStep
];

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

function titleStep({ state, setState }: WihFlowComponentProps<OneTimeEvent>) {
    return (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                onChangeText={(title) => setState({ Title: title })} />
        </WihView>
    )
}

function dateStep({ state, setState }: WihFlowComponentProps<OneTimeEvent>) {
    return (
        <WihView center="full">
            <WihTitle>Event Date & Time</WihTitle>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput
                    value={state.Date}
                    onChange={(date) => setState({ Date: date })} />
            </WihView>

            <WihView flex="row">
                <WihText>Start:</WihText>
                <WihTimeInput
                    value={state.StateTime}
                    onChange={(time) => setState({ StateTime: time })} />
            </WihView>

            <WihView flex="row">
                <WihText>End:</WihText>
                <WihTimeInput
                    value={state.EndTime}
                    onChange={(time) => setState({ EndTime: time })} />
            </WihView>
        </WihView>
    )
}

function dinnerTimeStep({ state, setState }: WihFlowComponentProps<OneTimeEvent>) {
    return (
        <WihView center="full">
            <WihTitle>Dinner Time?</WihTitle>
            {/* TODO: Single Choice for PresenceType. But you can only select a time if you have selected "Late" */}
            <WihTimeInput
                value={state.DinnerTime ?? undefined}
                onChange={(time) => setState({ DinnerTime: time })}
                disabled={state.PresenceType !== "Late"} />
        </WihView>
    )
}

function summaryStep({ state }: WihFlowComponentProps<OneTimeEvent>) {
    return (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
        </WihView>
    );
}