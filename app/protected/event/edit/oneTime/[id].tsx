import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {OneTimeEvent, OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";
import {WihText} from "@/components/WihText";
import React, {useCallback} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihResponse} from "@/helper/WihApi";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";

export default function OneTimeEventView(){
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();
    const response = useWihApiFocus<OneTimeEventModel>({
        endpoint: `OneTimeEvent/${id}`,
        method: "GET"
    });

    const onResponse = (body: WihResponse | null) => {
        // TODO: route to view or show error
        if(body?.hasError){
            return;
        }

        router.replace(`/protected/event/view/oneTime/${id}`);
    }

    const callWihApi = useWihApiCallable({
        endpoint: `OneTimeEvent/${id}`,
        method: "PATCH",
        onResponse
    });

    if (!response?.response) {
        return null;
    }

    const onCancel = useCallback(() => {
        router.push(`/protected/event/view/oneTime/${id}`);
    }, [id]);

    const onUpdate = useCallback(() => {
        // TODO: send updated to API
        callWihApi({});
    }, []);

    const event = new OneTimeEvent(response?.response);

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihText>Title: {event.Title ?? "Unknown"}</WihText>

            <WihText>Date: {event.Date?.toLocaleDateString() ?? "N/A"}</WihText>

            <WihText>Start Time: {event.StartTime?.toLocaleTimeString() ?? "N/A"}</WihText>
            <WihText>End Time: {event.EndTime?.toLocaleTimeString() ?? "N/A"}</WihText>

            <WihText>Presence Type: {event.PresenceType ?? "Missing"}</WihText>
            <WihText>Dinner Time: {event.DinnerTime?.toLocaleTimeString() ?? "N/A"}</WihText>
        </EventEditLayout>
    )
}