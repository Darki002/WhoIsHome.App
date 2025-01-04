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
import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";
import {PresenceType} from "@/constants/WihTypes/PresenceType";

const options: Array<WihOption<PresenceType>> = [
    {value: "Unknown", display: "Unknown"},
    {value: "Late", display: "Late"},
    {value: "NotPresent", display: "Not Present"}
]

export default function OneTimeEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const [event, setEvent] = useState<OneTimeEvent | null>(new OneTimeEvent());
    useEffect(() => {
        if (!response || !response.response || response.hasError) {
            return;
        }
        const event = new OneTimeEvent(response?.response);
        setEvent(event);
    }, [response]);

    const updateEvent = useCallback((update: Partial<OneTimeEvent>) => {
        setEvent((prev) => ({...prev, ...update}));
    }, []);

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
        router.back();
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
        if (!event) return;
        const body: OneTimeEventDto = {
            Title: event.Title!,
            Date: formatDate(event.Date!),
            StartTime: formatTime(event.StartTime!),
            EndTime: formatTime(event.EndTime!),
            PresenceType: event.PresenceType!,
            DinnerTime: event.DinnerTime ? formatTime(event.DinnerTime) : null
        }
        callWihApi(body);
    }, [event]);

    if (!event) {
        return null;
    }

    const onDinnerTimeChange = (time: Date | undefined) => {
        const value = event.PresenceType === "Late" ? time : null;
        updateEvent({DinnerTime: value});
    }

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        updateEvent({PresenceType: presenceType});
        if (presenceType !== "Late") {
            updateEvent({DinnerTime: null});
        }
    }

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihView flex="row">
                <WihText>Title:</WihText>
                <WihTextInput value={event.Title} placeholder="Titel"
                              onChangeText={t => updateEvent({Title: t})}></WihTextInput>
            </WihView>

            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput value={event.Date} onChange={d => updateEvent({Date: d})}></WihDateInput>
            </WihView>

            <WihView flex="row">
                <WihText>Start Time:</WihText>
                <WihTimeInput value={event.StartTime} onChange={st => updateEvent({StartTime: st})}></WihTimeInput>
            </WihView>

            <WihView flex="row">
                <WihText>End Time:</WihText>
                <WihTimeInput value={event.EndTime} onChange={et => updateEvent({EndTime: et})}></WihTimeInput>
            </WihView>

            <WihView flex="row">
                <WihText>Presence Type:</WihText>
                <WihSingleChoice
                    value={event.PresenceType}
                    options={options}
                    direction="row"
                    onChange={onPresenceTypeChange}/>
            </WihView>

            <WihView flex="row">
                <WihText>Dinner Time:</WihText>
                <WihTimeInput
                    value={event.DinnerTime}
                    disabled={event.PresenceType !== "Late"}
                    onChange={onDinnerTimeChange}/>
            </WihView>
        </EventEditLayout>
    )
}