import {useCallback, useEffect, useState} from "react";
import {WihResponse} from "@/helper/WihFetch";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export interface WihApiIntervalProps {
    time: number;
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiInterval<T>({time, ...props}: WihApiIntervalProps): [WihResponse<T | null> | null, (callback: () => void) => void] {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihFetch<T>(props)

    useEffect(() => {
        const id = setInterval(() => {
            callApi(props.body).then(e => setResponse(e));
        }, time);

        callApi(props.body).then(e => setResponse(e));

        return () => clearInterval(id);
    }, []);

    const refresh = useCallback((callback?: () => void) => {
        callApi(props.body)
            .then(e => setResponse(e))
            .then(() => callback && callback());
    }, [props]);

    return [response, refresh];
}