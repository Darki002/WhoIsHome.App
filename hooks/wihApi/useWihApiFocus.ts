import {wihFetch, WihResponse} from "@/helper/WihApi";
import {useCallback, useState} from "react";
import {useSession} from "@/components/auth/context";
import {useFocusEffect} from "expo-router";
import {Tokens} from "@/constants/WihTypes/Auth";
import {useApiConfig} from "@/components/config/context";

export interface WihApiProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    version?: number;
    body?: any;
}

export default function useWihApiFocus<T>({endpoint, method, version = 1, body}: WihApiProps) {
    const {config} = useApiConfig();
    const [response, setResponse] = useState<WihResponse<T | null> | null>(null);
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens: Tokens | undefined) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (!session) return;

            wihFetch<T>({endpoint, method, version, body, tokens: session, config: config!, onNewTokens})
                .then(e => setResponse(e));
        }, [endpoint])
    );

    return response;
}