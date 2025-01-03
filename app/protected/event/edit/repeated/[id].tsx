import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import React, {useCallback, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihText";
import {RepeatedEvent, RepeatedEventDto, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/helper/WihApi";
import WihView from "@/components/WihView";
import {WihTextInput} from "@/components/input/WihInput";
import {WihDateInput, WihTimeInput} from "@/components/input/WihDateTimeInput";
import {formatDate, formatTime} from "@/helper/datetimehelper";

export default function RepeatedEventView(){
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: `RepeatedEvent/${id}`,
        method: "GET"
    });

    const [state, setState] = useState<RepeatedEvent>(new RepeatedEvent());

    const onResponse = (body: WihResponse | null) => {
        // TODO: route to view or show error
        if(body?.hasError){
            return;
        }

        router.replace(`/protected/event/view/repeated/${id}`);
    }

    const callWihApi = useWihApiCallable<RepeatedEventDto>({
        endpoint: `RepeatedEvent/${id}`,
        method: "PATCH",
        onResponse
    });

    const updateState = (update: Partial<RepeatedEvent>) => {
        setState((prev) => ({...prev, ...update}));
    }

    const onCancel = useCallback(() => {
        router.push(`/protected/event/view/repeated/${id}`);
    }, [id]);

    if (!response?.response) {
        return null;
    }

    const onUpdate = () => {
        const body : RepeatedEventDto = {
            Title: state.Title!,
            FirstOccurrence: formatDate(state.FirstOccurrence!),
            LastOccurrence: formatDate(state.LastOccurrence!),
            StartTime: formatTime(state.StartTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: formatTime(state.DinnerTime!)
        }
        callWihApi(body);
    };

    const event = new RepeatedEvent(response?.response);

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihView flex="row">
                <WihText>Title:</WihText>
                <WihTextInput value={state.Title} placeholder="Titel" onChangeText={t => updateState({Title: t})}></WihTextInput>
            </WihView>

            <WihView flex="row">
                <WihText>First Occurrence:</WihText>
                <WihDateInput value={state.FirstOccurrence} onChange={d => updateState({FirstOccurrence: d})}></WihDateInput>
            </WihView>

            <WihView flex="row">
                <WihText>Last Occurrence:</WihText>
                <WihDateInput value={state.LastOccurrence} onChange={d => updateState({LastOccurrence: d})}></WihDateInput>
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