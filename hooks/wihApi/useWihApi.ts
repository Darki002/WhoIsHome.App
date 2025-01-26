import {wihFetch, WihResponse} from "@/helper/WihFetch";
import {useEffect, useState} from "react";
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

export default function useWihApi<T>(props: WihApiProps) {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const callApi = useWihFetch<T>(props);

    useEffect(() => {
        callApi(props.body).then(e => setResponse(e));
    }, [props]);

    return response;
}