import {WihText} from "@/components/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import {useCallback} from "react";
import {OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";

export default function OneTimeEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const onEdit = useCallback(() => {
        router.push(`/event/edit/oneTime/${id}`);
    }, [id]);

    const event = response?.response;

    if(!event){
        return null;
    }

    return (
        <EventViewLayout response={response} onEdit={onEdit}>
            <WihText>Title: {event.title ?? "Unknown"}</WihText>

            <WihText>Date: {event.date?.toLocaleDateString() ?? "N/A"}</WihText>

            <WihText>Start Time: {event.startTime?.toLocaleTimeString() ?? "N/A"}</WihText>
            <WihText>End Time: {event.endTime?.toLocaleTimeString() ?? "N/A"}</WihText>

            <WihText>Presence Type: {event.presenceType ?? "Missing"}</WihText>
            <WihText>Dinner Time: {event.dinnerTime?.toLocaleTimeString() ?? "N/A"}</WihText>
        </EventViewLayout>
    )
}