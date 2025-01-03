import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {OneTimeEvent, OneTimeEventDto, OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";
import {WihText} from "@/components/WihText";
import React, {useCallback, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihResponse} from "@/helper/WihApi";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import {WihTextInput} from "@/components/input/WihInput";
import WihView from "@/components/WihView";
import {WihDateInput, WihTimeInput} from "@/components/input/WihDateTimeInput";

export default function OneTimeEventView(){
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const [state, setState] = useState<OneTimeEvent>(new OneTimeEvent());

    const onResponse = (body: WihResponse | null) => {
        // TODO: route to view or show error
        if(body?.hasError){
            return;
        }

        router.replace(`/protected/event/view/oneTime/${id}`);
    }

    const callWihApi = useWihApiCallable<OneTimeEventDto>({
        endpoint: `OneTimeEvent/${id}`,
        method: "PATCH",
        onResponse
    });

    const updateState = (update: Partial<OneTimeEvent>) => {
        setState((prev) => ({...prev, ...update}));
    }

    const onCancel = useCallback(() => {
        router.push(`/protected/event/view/oneTime/${id}`);
    }, [id]);

    if (!response?.response) {
        return null;
    }

    const onUpdate = () => {
        const body : OneTimeEventDto = {
            Title: state.Title!,
            Date: formatDate(state.Date!),
            StartTime: formatTime(state.StartTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: formatTime(state.DinnerTime!)
        }
        callWihApi(body);
    };

    const event = new OneTimeEvent(response?.response);

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihView flex="row">
                <WihText>Title:</WihText>
                <WihTextInput value={state.Title} placeholder="Titel" onChangeText={t => updateState({Title: t})}></WihTextInput>
            </WihView>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput value={state.Date} onChange={d => updateState({Date: d})}></WihDateInput>
            </WihView>

            <WihView flex="row">
                <WihText>Start Time:</WihText>
                <WihTimeInput value={state.StartTime} onChange={st => updateState({StartTime: st})}></WihTimeInput>
            </WihView>

            <WihView flex="row">
                <WihText>End Time:</WihText>
                <WihTimeInput value={state.EndTime} onChange={et => updateState({EndTime: et})}></WihTimeInput>
            </WihView>

            <WihText>Presence Type: {event.PresenceType ?? "Missing"}</WihText>

            <WihView flex="row">
                <WihText>Dinner Time:</WihText>
                <WihDateInput value={state.DinnerTime} onChange={d => updateState({DinnerTime: d})}></WihDateInput>
            </WihView>
        </EventEditLayout>
    )
}