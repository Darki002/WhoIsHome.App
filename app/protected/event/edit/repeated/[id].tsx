import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import React, {useCallback} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihText";
import {RepeatedEvent, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";

export default function RepeatedEventView(){
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: `RepeatedEvent/${id}`,
        method: "GET"
    });

    if (!response?.response) {
        return null;
    }

    const onCancel = useCallback(() => {
        router.push(`/protected/event/view/repeated/${id}`);
    }, [id]);

    const onUpdate = useCallback(() => {
        // TODO: send updated to API
    }, []);

    const event = new RepeatedEvent(response?.response);

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihText>Title: {event.Title ?? "Unknown"}</WihText>

            <WihText>First Occurrence: {event.FirstOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>
            <WihText>Last Occurrence: {event.LastOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>

            <WihText>Start Time: {event.StartTime?.toLocaleTimeString() ?? "N/A"}</WihText>
            <WihText>End Time: {event.EndTime?.toLocaleTimeString() ?? "N/A"}</WihText>

            <WihText>Presence Type: {event.PresenceType ?? "Missing"}</WihText>
            <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString() ?? "-"}</WihText>
        </EventEditLayout>
    )
}