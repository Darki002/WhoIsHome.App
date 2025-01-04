import {WihText} from "@/components/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import {useCallback} from "react";
import {RepeatedEvent, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";

export default function RepeatedEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: `RepeatedEvent/${id}`,
        method: "GET"
    });

    const onEdit = useCallback(() => {
        router.push(`/protected/event/edit/repeated/${id}`);
    }, [id]);

    if (!response?.response) {
        return null;
    }

    const event = new RepeatedEvent(response?.response);

    return (
        <EventViewLayout response={response} onEdit={onEdit}>
            <WihText>Title: {event.Title ?? "Unknown"}</WihText>

            <WihText>First Occurrence: {event.FirstOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>
            <WihText>Last Occurrence: {event.LastOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>

            <WihText>Start Time: {event.StartTime?.toLocaleTimeString() ?? "N/A"}</WihText>
            <WihText>End Time: {event.EndTime?.toLocaleTimeString() ?? "N/A"}</WihText>

            <WihText>Presence Type: {event.PresenceType ?? "Missing"}</WihText>
            <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString() ?? "-"}</WihText>
        </EventViewLayout>
    )
}