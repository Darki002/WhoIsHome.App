import {useEffect, useState} from "react";
import {KeyValuePair, wihFetch, WihResponse} from "@/components/api/whoIsHomeApi";
import {useSession} from "@/components/auth/context";
import {Tokens} from "@/constants/WihTypes";

export interface WihApiIntervalProps {
    time: number;
    endpoint: string;
    version?: number;
    body?: KeyValuePair;
    method: "GET" | "POST" | "DELETE";
}

export default function useWihApiInterval<T>({time, endpoint, method, version = 1, body} : WihApiIntervalProps) : WihResponse<T | null> | null {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens : Tokens | null) {
        if(tokens){
            onNewSession(tokens);
        }
    }

    useEffect(() => {
        if(!session) return () => {};

        wihFetch<T>({endpoint, method, version, body, tokens: session, onNewTokens})
            .then(e => setResponse(e));

        // Refresh every other Minute
        const id = setInterval(() => {
            wihFetch<T>({endpoint, method, version, body, tokens: session, onNewTokens})
                .then(e => setResponse(e));
        }, time);
        return () => clearInterval(id);
    }, []);

    return response;
}