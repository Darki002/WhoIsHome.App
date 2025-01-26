import {wihFetch, WihResponse} from "@/helper/WihFetch";
import {useCallback, useEffect, useState} from "react";
import {useSession} from "@/components/appContexts/AuthContext";
import {Tokens} from "@/constants/WihTypes/Auth";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApi<T>(props: WihApiProps) : [WihResponse<T | null> | null, (callback?: () => void) => void] {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihFetch<T>(props);

    useEffect(() => {
        callApi(props.body).then(e => setResponse(e));
    }, [props]);

    const refresh = useCallback((callback?: () => void) => {
        callApi(props.body)
            .then(e => setResponse(e))
            .then(() => callback && callback());
    }, [props]);

    return [response, refresh];
}