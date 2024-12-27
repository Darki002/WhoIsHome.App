import {useNavigation} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {fromEventType} from "@/constants/WihEndpoints";
import {useEffect} from "react";
import {EventBase, EventType} from "@/constants/WihTypes";

export default function useWihEventApi<T extends EventBase>({id, type} : {id: string, type: EventType}) {
    const navigation = useNavigation();

    const response = useWihApiFocus<T>({
        endpoint: `${fromEventType(type)}/${id}`,
        method: "GET"
    });

    useEffect(() => {
        if (!response) {
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if (response.hasError) {
            navigation.setOptions({title: "Error"});
            return;
        }
        navigation.setOptions({title: response.response?.Title});
    }, [response]);

    return response;
}