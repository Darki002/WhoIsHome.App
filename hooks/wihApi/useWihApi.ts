import {WihResponse} from "@/helper/WihFetch";
import {useCallback, useEffect, useState} from "react";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

// keep in mind it will only call the API gain when the body changes but not it endpoint, method or version changes.
export default function useWihApi<T>({endpoint, body, method, version}: WihApiProps) : [WihResponse<T | null> | null, () => Promise<void>] {
    const [response, setResponse] = useState<WihResponse<T> | null>(null);
    const callApi = useWihFetch<T>({endpoint, method, version});

    useEffect(() => {
        callApi(body).then(e => setResponse(e));
    }, [body]);

    const refresh = useCallback(async () => {
        callApi(body).then(e => setResponse(e));
    }, [body]);

    return [response, refresh];
}