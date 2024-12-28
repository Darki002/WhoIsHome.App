import useWihEventApi from "@/hooks/wihApi/useWihEventApi";
import {OneTimeEvent} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams} from "expo-router";

function OneTimeEventView(){
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihEventApi<OneTimeEvent>({id: id, type: "oneTime"});
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