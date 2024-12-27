import {RepeatedEventModel} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import EventViewLayout from "@/components/EventView/EventViewLayout";

function RepeatedEventView() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: `RepeatedEvent/${id}`,
        method: "GET"
    });

    const event = response?.response!;

    const onEdit = () => {

    }

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