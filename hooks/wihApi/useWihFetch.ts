import {wihFetch} from "@/helper/WihFetch";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import {useSession} from "@/components/appContexts/AuthContext";
import {Tokens} from "@/constants/WihTypes/Auth";
import {useCallback} from "react";

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    version?: number;
}

const useWihFetch = <T>(props: WihFetchProps)  => {
    const {config} = useApiConfig();
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens: Tokens | undefined) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    return useCallback(async (body: T) => {
        if (!session) return null;

        const params = {
            endpoint: props.endpoint,
            method: props.method,
            version: props.version,
            body: body,
            tokens: session,
            config: config!,
            onNewTokens: onNewTokens
        }

        return await wihFetch<T>(params);
    }, [props]);
}

export default useWihFetch;
