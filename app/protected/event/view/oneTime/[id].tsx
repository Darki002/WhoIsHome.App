import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import React, {useCallback} from "react";
import {OneTimeEvent, OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";
import {WihText} from "@/components/WihText";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";

export default function OneTimeEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const onEdit = useCallback(() => {
        router.push(`/protected/event/edit/oneTime/${id}`);
    }, [id]);


    if (!response?.response) {
        return null;
    }

    const event = new OneTimeEvent(response?.response);

    return (
        <EventViewLayout response={response} onEdit={onEdit}>
            <WihText>Title: {event.Title ?? "Unknown"}</WihText>

            <WihText>Date: {event.Date?.toLocaleDateString() ?? "N/A"}</WihText>

            <WihText>Start Time: {event.StartTime?.toLocaleTimeString() ?? "N/A"}</WihText>
            <WihText>End Time: {event.EndTime?.toLocaleTimeString() ?? "N/A"}</WihText>

            <WihText>Presence Type: {event.PresenceType ?? "Missing"}</WihText>
            <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString() ?? "N/A"}</WihText>
        </EventViewLayout>
    )
}