import {useCallback} from "react";
import {wihFetch, WihResponse} from "@/helper/WihApi";
import {useSession} from "@/components/auth/context";
import {Tokens} from "@/constants/WihTypes/Auth";

export interface WihApiProps<T> {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    onResponse: (response: WihResponse<T> | null) => void;
    version?: number;
}

export default function useWihApiCallable<T = {}>({
                                                      endpoint,
                                                      onResponse,
                                                      method,
                                                      version = 1
                                                  }: WihApiProps<T>): (body: any) => void {
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens: Tokens | undefined) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    return useCallback((body: any) => {
        if (!session) return;

        wihFetch<T>({endpoint, method, version, body, tokens: session, onNewTokens})
            .then(e => onResponse(e));
    }, [endpoint]);
}