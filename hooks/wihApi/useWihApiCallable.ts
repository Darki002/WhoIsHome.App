import {WihResponse} from "@/helper/WihFetch";
import {useCallback} from "react";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export interface WihApiProps<T> {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    onResponse: (response: WihResponse<T> | null) => void;
    version?: number;
}

export default function useWihApiCallable<T = {}>(props: WihApiProps<T>): (body: T) => void {
    const callApi = useWihFetch<T>(props);
    return useCallback((body: T) => {
        return callApi(body);
    }, []);
}