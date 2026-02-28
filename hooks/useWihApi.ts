import {useApiConfig} from "@/hooks/useApiConfig";
import {useSession} from "@/components/appContexts/AuthContext";
import {Tokens} from "@/constants/WihTypes/Auth";
import {WihResponse} from "@/helper/fetch/WihResponse";
import {WihFetchBuilder} from "@/helper/fetch/WihFetchBuilder";
import {WihLogger} from "@/helper/WihLogger";

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    version?: number;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

const useWihApi = <TBody = unknown, TResponse = unknown, TQuery extends QueryParams = QueryParams>(
    props: WihFetchProps
): (body?: TBody, queryParams?: TQuery) => Promise<WihResponse<TResponse> | string> => {

    const config = useApiConfig();
    const { session, onNewSession, signOut } = useSession();

    function onNewTokens(tokens: Tokens | undefined | null) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    return async (body?: TBody, queryParams?: TQuery): Promise<WihResponse<TResponse> | string> => {
        if (!session?.jwtToken || !session?.refreshToken) {
            const error = `Skip Request ${props.endpoint} due to missing session!`;
            WihLogger.warn("useWihApi", error);
            return error;
        }

        if (!config?.apikey || !config.baseUri) {
            const error = `Skip Request ${props.endpoint} due to missing API Key or baseUri!`;
            WihLogger.warn("useWihApi", error);
            return error;
        }

        // Create the final endpoint string with query params
        const fullEndpoint = buildEndpointWithQuery(props.endpoint, queryParams);

        const response = await new WihFetchBuilder(config, session)
            .setEndpoint(fullEndpoint)
            .setMethod(props.method)
            .setVersion(props.version)
            .setBody(body)
            .addNewTokenListener(onNewTokens)
            .fetch<TResponse>();

        if (response.refreshFailed) {
            signOut();
        }

        return response;
    };
};

function buildEndpointWithQuery(endpoint: string, params?: QueryParams): string {
    if (!params || Object.keys(params).length === 0) {
        return endpoint;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `${endpoint}?${queryString}` : endpoint;
}

export default useWihApi;
