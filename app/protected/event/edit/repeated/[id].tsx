import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import React, {useCallback, useEffect, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihText";
import {RepeatedEvent, RepeatedEventDto, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/helper/WihApi";
import WihView from "@/components/WihView";
import {WihTextInput} from "@/components/input/WihInput";
import {WihDateInput, WihTimeInput} from "@/components/input/WihDateTimeInput";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import Toast from "react-native-root-toast";

export default function RepeatedEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: `RepeatedEvent/${id}`,
        method: "GET"
    });

    const [event, setEvent] = useState<RepeatedEvent | null>(new RepeatedEvent());
    useEffect(() => {
        if (!response || !response.response || response.hasError) {
            return;
        }
        const repeatedEvent = new RepeatedEvent(response?.response);
        setEvent(repeatedEvent);
    }, [response]);

    const updateState = (update: Partial<RepeatedEvent>) => {
        setEvent((prev) => ({...prev, ...update}));
    }

    const onResponse = useCallback((res: WihResponse | null) => {
        if (!res || res?.hasError) {
            console.error(res?.error ?? "Unknown Error");
            Toast.show('Failed to update Event', {
                duration: Toast.durations.SHORT,
            });
            return;
        }

        Toast.show('Event updated', {
            duration: Toast.durations.SHORT,
        });
        router.replace(`/protected/event/view/repeated/${id}`);
    }, [id])

    const callWihApi = useWihApiCallable<RepeatedEventDto>({
        endpoint: `RepeatedEvent/${id}`,
        method: "PATCH",
        onResponse
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => useCallback(() => {
        if (!event) return;
        const body: RepeatedEventDto = {
            Title: event.Title!,
            FirstOccurrence: formatDate(event.FirstOccurrence!),
            LastOccurrence: formatDate(event.LastOccurrence!),
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
                <WihTextInput value={event.Title} placeholder="Titel"
                              onChangeText={t => updateState({Title: t})}></WihTextInput>
            </WihView>

            <WihView flex="row">
                <WihText>First Occurrence:</WihText>
                <WihDateInput value={event.FirstOccurrence}
                              onChange={d => updateState({FirstOccurrence: d})}></WihDateInput>
            </WihView>

            <WihView flex="row">
                <WihText>Last Occurrence:</WihText>
                <WihDateInput value={event.LastOccurrence}
                              onChange={d => updateState({LastOccurrence: d})}></WihDateInput>
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
                <WihTimeInput value={event.DinnerTime} onChange={d => updateState({DinnerTime: d})}></WihTimeInput>
            </WihView>
        </EventEditLayout>
    )
}