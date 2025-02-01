import {wihFetch} from "@/helper/WihFetch";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import {useSession} from "@/components/appContexts/AuthContext";
import {Tokens} from "@/constants/WihTypes/Auth";

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    version?: number;
}

const useWihFetch = <T>(props: WihFetchProps)  => {
    const {config} = useApiConfig();
    const {session, onNewSession, signOut} = useSession();

    function onNewTokens(tokens: Tokens | undefined) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    return async (body?: T) => {
        if (!session) return null;

        if(props.method === "GET" && body){
            console.warn(`Attempting a GET request with a body for ${props.endpoint}`);
            return null;
        }

        const params = {
            endpoint: props.endpoint,
            method: props.method,
            version: props.version,
            body: body,
            tokens: session,
            config: config!,
            onNewTokens: onNewTokens
        }

        const response = await wihFetch<T>(params);

        if(response.refreshFailed){
            signOut();
        }

        return response;
    }
}

export default useWihFetch;
