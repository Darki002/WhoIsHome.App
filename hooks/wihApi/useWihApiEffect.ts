import {useCallback, useEffect, useState} from "react";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {WihResponse} from "@/helper/fetch/WihResponse";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

// keep in mind it will only call the API gain when the body changes but not it endpoint, method or version changes.
export default function useWihApiEffect<T>({endpoint, body, method, version}: WihApiProps) : [WihResponse<T | null> | null, () => Promise<void>] {
    const [response, setResponse] = useState<WihResponse<T> | null>(null);
    const callApi = useWihApi<T>({endpoint, method, version});

    useEffect(() => {
        callApi(body).then(e => setResponse(e));
    }, [body]);

    const refresh = useCallback(() => {
       return (async () => {
            const r = await callApi(body);
            setResponse(r);
        })()
    }, [body]);

    return [response, refresh];
}