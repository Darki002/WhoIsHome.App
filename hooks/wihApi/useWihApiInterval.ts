import {useEffect, useState} from "react";
import {wihFetch, WihResponse} from "@/components/api/WihApi";
import {useSession} from "@/components/auth/context";
import {Tokens} from "@/constants/WihTypes";

export interface WihApiIntervalProps {
    time: number;
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiInterval<T>({
                                                 time,
                                                 endpoint,
                                                 method,
                                                 version = 1,
                                                 body
                                             }: WihApiIntervalProps): WihResponse<T | null> | null {
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens: Tokens | undefined) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    useEffect(() => {
        if (!session) return () => {
        };

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