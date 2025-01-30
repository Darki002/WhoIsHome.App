import {wihFetch, WihResponse} from "@/helper/WihFetch";
import {useCallback, useState} from "react";
import {useSession} from "@/components/appContexts/AuthContext";
import {useFocusEffect} from "expo-router";
import {Tokens} from "@/constants/WihTypes/Auth";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiFocus<T>(props: WihApiProps): [WihResponse<T | null> | null, (c: () => void) => void] {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihFetch<T>(props);

    useFocusEffect(useCallback(() => {
        callApi(props.body).then(e => setResponse(e));
    }, [props.body]));

    const refresh = useCallback((callback?: () => void) => {
        callApi(props.body)
            .then(e => setResponse(e))
            .then(() => callback && callback());
    }, [props.body]);

    return [response, refresh];
}