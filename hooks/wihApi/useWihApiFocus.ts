import {useCallback, useState} from "react";
import {useFocusEffect} from "expo-router";
import useWihFetch from "@/hooks/wihApi/useWihFetch";
import {WihResponse} from "@/helper/fetch/WihResponse";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiFocus<T>(props: WihApiProps): [WihResponse<T | null> | null, () => Promise<void>] {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihFetch<T>(props);

    useFocusEffect(useCallback(() => {
        callApi(props.body).then(e => setResponse(e));
    }, [props.body]));

    const refresh = useCallback(async () => {
        callApi(props.body).then(e => setResponse(e));
    }, [props.body]);

    return [response, refresh];
}