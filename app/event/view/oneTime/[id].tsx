import {OneTimeEvent} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/EventView/EventViewLayout";

function OneTimeEventView() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEvent>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const event = response?.response!;

    const onEdit = () => {

    }

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