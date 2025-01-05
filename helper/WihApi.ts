import {Tokens} from "@/constants/WihTypes/Auth";
import {Endpoints} from "@/constants/endpoints";

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    tokens?: Tokens;
    version?: number;
    body?: any;
    onNewTokens?: (newTokens: Tokens | undefined) => void;
}

export interface WihResponse<T = {}> {
    status: number;
    hasError: boolean;
    error: string | null;
    response?: T;
}

export const wihFetch = async <TBody>({
                                          endpoint,
                                          method = "GET",
                                          body,
                                          tokens,
                                          version = 1,
                                          onNewTokens
                                      }: WihFetchProps): Promise<WihResponse<TBody>> => {
    let response = await authFetch<TBody>(endpoint, method, body, tokens, version);

    if (tokens && response.hasError && response.status === 401) {
        const newTokens = await refreshJwtToken(tokens.refreshToken!);

        if (newTokens.hasError) {
            onNewTokens ? onNewTokens(undefined) : null;
            return ({
                status: newTokens.status,
                hasError: true,
                error: newTokens.error
            });
        }

        onNewTokens ? onNewTokens(newTokens.response) : null;
        response = await authFetch<TBody>(endpoint, method, body, newTokens.response!, version);
        return response;
    }

    return response;
}

async function authFetch<T>(endpoint: string, method: string, body: any | undefined, tokens: Tokens | undefined, version: number): Promise<WihResponse<T>> {
    const uri = getUri(endpoint, version);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-API-KEY", process.env.EXPO_PUBLIC_API_KEY!);

    if (tokens) {
        headers.append("Authorization", `Bearer ${tokens.jwtToken}`);
    }

    console.info(`${method} on ${uri}`)

    try {
        const response = await fetch(uri, {
            method: method,
            headers: headers,
            mode: "cors",
            body: JSON.stringify(body)
        });

        return await handleResponse(response);
    } catch (error: any) {
        console.error(`Request failed: ${error.message}`);
        return ({
            status: 0,
            hasError: true,
            error: error.message
        });
    }
}

async function refreshJwtToken(refreshToken: string): Promise<WihResponse<Tokens>> {
    const uri = getUri(Endpoints.auth.refresh);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-API-KEY", process.env.EXPO_PUBLIC_API_KEY!);
    headers.append("RefreshToken", refreshToken);

    try {
        const response = await fetch(uri, {
            method: "POST",
            mode: "cors",
            headers: headers
        });

        return await handleResponse<Tokens>(response);
    } catch (error: any) {
        console.error(`Request failed: ${error.message}`);
        return ({
            status: 0,
            hasError: true,
            error: error.message
        });
    }
}

async function handleResponse<T>(response: Response): Promise<WihResponse<T>> {
    if (response.status === 200) {

        const body = await response.json();
        return ({
            status: response.status,
            hasError: false,
            error: null,
            response: body as T
        });
    }

    const message = await response.text();
    console.warn(`Request with error Status "${response.statusText}" - ${response.status} | Message: ${message}`);

    switch (response.status) {
        case 401:
            return ({
                status: response.status,
                hasError: true,
                error: response.statusText
            });
        default:
            return ({
                status: response.status,
                hasError: true,
                error: response.statusText
            });
    }
}

function getUri(endpoint: string, version: number = 1): string {
    return `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/v${version}/${endpoint}`;
}