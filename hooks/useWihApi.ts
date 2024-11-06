import {KeyValuePair, wihFetch, WihResponse} from "@/components/api/WihApi";
import {useEffect, useState} from "react";
import {useSession} from "@/components/auth/context";
import {Tokens} from "@/constants/WihTypes";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: KeyValuePair;
}

export default function useWihApi<T>({endpoint, method, version = 0, body} : WihApiProps){
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens : Tokens | null) {
        if(tokens){
            onNewSession(tokens);
        }
    }

    useEffect(() => {
        if(!session) return;

        wihFetch<T>({endpoint, method, version, body, tokens: session, onNewTokens})
            .then(e => setResponse(e));
    }, []);

    return response;
}