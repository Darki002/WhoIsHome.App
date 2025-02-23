import {WihApiError, wihFetch, WihResponse} from "@/helper/WihFetch";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import {useSession} from "@/components/appContexts/AuthContext";
import {Tokens} from "@/constants/WihTypes/Auth";
import * as Sentry from "@sentry/react-native"

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    version?: number;
}

const useWihFetch = <T>(props: WihFetchProps) => {
    const {config} = useApiConfig();
    const {session, onNewSession, signOut} = useSession();

    function onNewTokens(tokens: Tokens | undefined | null) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    return async (body?: T): Promise<WihResponse<T> | null> => {
        if (!session) return null;

        if (props.method === "GET" && body) {
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

        try {
            const response = await wihFetch<T>(params);

            if (response.refreshFailed) {
                signOut();
            }

            return response;
        } catch (error: any) {

            if (error instanceof WihApiError) {
                console.warn(error.message);
                return error.response;
            } else {
                Sentry.captureException(error);
                console.error(error);
                return {
                    hasError: true,
                    error: "unknown error",
                    response: null,
                    refreshFailed: false,
                    status: 0
                }
            }
        }
    }
}

export default useWihFetch;
