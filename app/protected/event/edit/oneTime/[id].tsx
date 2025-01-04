import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {OneTimeEvent, OneTimeEventDto, OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";
import {WihText} from "@/components/WihText";
import React, {useCallback, useEffect, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihResponse} from "@/helper/WihApi";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import {WihTextInput} from "@/components/input/WihInput";
import WihView from "@/components/WihView";
import {WihDateInput, WihTimeInput} from "@/components/input/WihDateTimeInput";
import Toast from "react-native-root-toast";

export default function OneTimeEventView(){
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const [event, setEvent] = useState<OneTimeEvent | null>(new OneTimeEvent());
    useEffect(() => {
        if(!response || !response.response || response.hasError){
            return;
        }
        const event = new OneTimeEvent(response?.response);
        setEvent(event);
    }, [response]);

    const updateState = useCallback((update: Partial<OneTimeEvent>) => {
        setEvent((prev) => ({...prev, ...update}));
    }, []);

    const onResponse = useCallback((res: WihResponse | null) => {
        if(!res || res?.hasError){
            console.error(res?.error ?? "Unknown Error");
            Toast.show('Failed to update Event', {
                duration: Toast.durations.SHORT,
            });
            return;
        }

        Toast.show('Event updated', {
            duration: Toast.durations.SHORT,
        });
        router.replace(`/protected/event/view/oneTime/${id}`);
    }, [id]);

    const callWihApi = useWihApiCallable<OneTimeEventDto>({
        endpoint: `OneTimeEvent/${id}`,
        method: "PATCH",
        onResponse
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = useCallback(() => {
        if(!event) return;
        const body : OneTimeEventDto = {
            Title: event.Title!,
            Date: formatDate(event.Date!),
            StartTime: formatTime(event.StartTime!),
            EndTime: formatTime(event.EndTime!),
            PresenceType: event.PresenceType!,
            DinnerTime: formatTime(event.DinnerTime!)
        }
        callWihApi(body);
    }, [event]);

    if (!event) {
        return null;
    }

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihView flex="row">
                <WihText>Title:</WihText>
                <WihTextInput value={event.Title} placeholder="Titel" onChangeText={t => updateState({Title: t})}></WihTextInput>
            </WihView>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput value={event.Date} onChange={d => updateState({Date: d})}></WihDateInput>
            </WihView>

            <WihView flex="row">
                <WihText>Start Time:</WihText>
                <WihTimeInput value={event.StartTime} onChange={st => updateState({StartTime: st})}></WihTimeInput>
            </WihView>

            <WihView flex="row">
                <WihText>End Time:</WihText>
                <WihTimeInput value={event.EndTime} onChange={et => updateState({EndTime: et})}></WihTimeInput>
            </WihView>

            <WihText>Presence Type: {event.PresenceType ?? "Missing"}</WihText>

            <WihView flex="row">
                <WihText>Dinner Time:</WihText>
                <WihDateInput value={event.DinnerTime} onChange={d => updateState({DinnerTime: d})}></WihDateInput>
            </WihView>
        </EventEditLayout>
    )
}