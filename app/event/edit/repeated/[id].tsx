import {RepeatedEvent} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useLocalSearchParams} from "expo-router";

function RepeatedEventView(){
    return null;
    // const {id} = useLocalSearchParams<{ id: string }>();
    // const response = useWihEventApi<RepeatedEvent>({id: id, type: "repeated"});
    // const event = response?.response!;
    //
    // return (
    //     <WihView>
    //         <WihText>Title: {event.Title}</WihText>
    //
    //         <WihText>First Occurrence: {event.FirstOccurrence?.toLocaleDateString()}</WihText>
    //         <WihText>Last Occurrence: {event.LastOccurrence?.toLocaleDateString()}</WihText>
    //
    //         <WihText>Start Time: {event.StartTime?.toLocaleTimeString()}</WihText>
    //         <WihText>End Time: {event.EndTime?.toLocaleTimeString()}</WihText>
    //
    //         <WihText>Presence Type: {event.PresenceType}</WihText>
    //         <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString()}</WihText>
    //     </WihView>
    // )
}