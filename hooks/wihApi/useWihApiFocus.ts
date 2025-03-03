import {useCallback, useState} from "react";
import {useFocusEffect} from "expo-router";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {WihResponse} from "@/helper/fetch/WihResponse";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiFocus<T>(props: WihApiProps): [WihResponse<T | null> | null, () => Promise<void>] {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihApi<T>(props);

    useFocusEffect(useCallback(() => {
        callApi(props.body).then(e => setResponse(e));
    }, [props.body]));

    const refresh = useCallback(async () => {
        const r = await callApi(props.body);
        setResponse(r);
    }, [props.body]);

    return [response, refresh];
}