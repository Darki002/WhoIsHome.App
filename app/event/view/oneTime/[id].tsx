import {OneTimeEventModel} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import {useCallback} from "react";

export default function OneTimeEventView() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const onEdit = () => useCallback(() => {
        router.push(`/event/edit/oneTime/${id}`);
    }, [id]);

    const event = response?.response!;

    return (
        <EventViewLayout response={response} onEdit={onEdit}>
            <WihView>
                <WihText>Title: {event.Title}</WihText>

                <WihText>Date: {event.Date?.toLocaleDateString()}</WihText>

                <WihText>Start Time: {event.StartTime?.toLocaleTimeString()}</WihText>
                <WihText>End Time: {event.EndTime?.toLocaleTimeString()}</WihText>

                <WihText>Presence Type: {event.PresenceType}</WihText>
                <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString()}</WihText>
            </WihView>
        </EventViewLayout>
    )
}