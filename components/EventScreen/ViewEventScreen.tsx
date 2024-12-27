import {OneTimeEvent, RepeatedEvent} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {EventComponent} from "@/app/(events)/eventScreen";
import useWihEventApi from "@/components/EventScreen/useWihEventApi";

export const eventViewComponentMap : EventComponent = {
    OneTime: OneTimeEventView,
    Repeated: RepeatedEventView
}

function OneTimeEventView({id} : {id: string}){
    const response = useWihEventApi<OneTimeEvent>({id: id, type: "OneTime"});
    const event = response?.response!;

    return (
        <WihView>
            <WihText>Title: {event.Title}</WihText>

            <WihText>Date: {event.Date?.toLocaleDateString()}</WihText>

            <WihText>Start Time: {event.StartTime?.toLocaleTimeString()}</WihText>
            <WihText>End Time: {event.EndTime?.toLocaleTimeString()}</WihText>

            <WihText>Presence Type: {event.PresenceType}</WihText>
            <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString()}</WihText>
        </WihView>
    )
}

function RepeatedEventView({id} : {id: string}){
    const response = useWihEventApi<RepeatedEvent>({id: id, type: "Repeated"});
    const event = response?.response!;

    return (
        <WihView>
            <WihText>Title: {event.Title}</WihText>

            <WihText>First Occurrence: {event.FirstOccurrence?.toLocaleDateString()}</WihText>
            <WihText>Last Occurrence: {event.LastOccurrence?.toLocaleDateString()}</WihText>

            <WihText>Start Time: {event.StartTime?.toLocaleTimeString()}</WihText>
            <WihText>End Time: {event.EndTime?.toLocaleTimeString()}</WihText>

            <WihText>Presence Type: {event.PresenceType}</WihText>
            <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString()}</WihText>
        </WihView>
    )
}