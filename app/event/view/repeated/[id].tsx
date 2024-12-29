import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import {useCallback} from "react";
import {RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";

export default function RepeatedEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: `RepeatedEvent/${id}`,
        method: "GET"
    });

    const onEdit = () => useCallback(() => {
        router.push(`/event/edit/repeated/${id}`);
    }, [id]);

    const event = response?.response!;

    return (
        <EventViewLayout response={response} onEdit={onEdit}>
            <WihView>
                <WihText>Title: {event.title}</WihText>

                <WihText>First Occurrence: {event.firstOccurrence?.toLocaleDateString()}</WihText>
                <WihText>Last Occurrence: {event.lastOccurrence?.toLocaleDateString()}</WihText>

                <WihText>Start Time: {event.startTime?.toLocaleTimeString()}</WihText>
                <WihText>End Time: {event.endTime?.toLocaleTimeString()}</WihText>

                <WihText>Presence Type: {event.presenceType}</WihText>
                <WihText>Dinner Time: {event.dinnerTime?.toLocaleTimeString()}</WihText>
            </WihView>
        </EventViewLayout>
    )
}