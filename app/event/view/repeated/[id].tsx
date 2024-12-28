import {RepeatedEventModel} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/EventView/EventViewLayout";
import {useCallback} from "react";

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
                <WihText>Title: {event.Title}</WihText>

                <WihText>First Occurrence: {event.FirstOccurrence?.toLocaleDateString()}</WihText>
                <WihText>Last Occurrence: {event.LastOccurrence?.toLocaleDateString()}</WihText>

                <WihText>Start Time: {event.StartTime?.toLocaleTimeString()}</WihText>
                <WihText>End Time: {event.EndTime?.toLocaleTimeString()}</WihText>

                <WihText>Presence Type: {event.PresenceType}</WihText>
                <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString()}</WihText>
            </WihView>
        </EventViewLayout>
    )
}