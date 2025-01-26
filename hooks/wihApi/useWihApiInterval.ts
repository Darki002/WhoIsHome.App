import {useEffect, useState} from "react";
import {WihResponse} from "@/helper/WihFetch";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export interface WihApiIntervalProps {
    time: number;
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiInterval<T>({time, ...props}: WihApiIntervalProps): WihResponse<T | null> | null {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihFetch<T>(props)

    useEffect(() => {
        const id = setInterval(() => {
            callApi(props.body).then(e => setResponse(e));
        }, time);
        return () => clearInterval(id);
    }, []);

    return response;
}