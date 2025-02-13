import {Tokens} from "@/constants/WihTypes/Auth";
import {Endpoints} from "@/constants/endpoints";
import {ApiConfig} from "@/components/appContexts/ConfigContext";

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    tokens?: Tokens;
    config: ApiConfig;
    version?: number;
    body?: any;
    onNewTokens?: (newTokens: Tokens | undefined | null) => void;
}

export interface WihResponse<T = {}> {
    status: number;
    hasError: boolean;
    error: string | null;
    refreshFailed: boolean;
    response?: T | null;
}

export const wihFetch = async <TBody>({
                                          endpoint,
                                          method = "GET",
                                          body,
                                          tokens,
                                          config,
                                          version = 1,
                                          onNewTokens
                                      }: WihFetchProps): Promise<WihResponse<TBody>> => {
    let response = await authFetch<TBody>(endpoint, method, body, tokens, config, version);

    if (tokens && response.hasError && response.status === 401) {
        const newTokens = await refreshJwtToken(tokens.refreshToken!, config);

        if (newTokens.hasError) {
            onNewTokens ? onNewTokens(undefined) : null;
            throw new WihApiError<Tokens>(newTokens.error || "Unknown error", newTokens)
        }

        onNewTokens ? onNewTokens(newTokens.response) : null;
        response = await authFetch<TBody>(endpoint, method, body, newTokens.response!, config, version);
        return response;
    }

    return response;
}

async function authFetch<T>(endpoint: string, method: string, body: any | undefined, tokens: Tokens | undefined, config: ApiConfig, version: number): Promise<WihResponse<T>> {
    const uri = getUri(config.baseUri!, endpoint, version);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-API-KEY", config.apikey!);

    if (tokens) {
        headers.append("Authorization", `Bearer ${tokens.jwtToken}`);
    }

    console.info(`${method} on ${uri}`);

    try {
        const response = await fetch(uri, {
            method: method,
            headers: headers,
            mode: "cors",
            body: JSON.stringify(body)
        });

        return await handleResponse(response);
    } catch (error: any) {
        if(error instanceof WihApiError){
            throw error;
        }
        throw new Error(`Network or Fetch Error: ${error.message}`);
    }
}

async function refreshJwtToken(refreshToken: string, config: ApiConfig): Promise<WihResponse<Tokens>> {
    const uri = getUri(config.baseUri!, Endpoints.auth.refresh);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-API-KEY", config.apikey!);
    headers.append("RefreshToken", refreshToken);

    try {
        const response = await fetch(uri, {
            method: "POST",
            mode: "cors",
            headers: headers
        });

        return await handleResponse<Tokens>(response);
    } catch (error: any) {
        if(error instanceof WihApiError){
            throw error;
        }
        throw new Error(`Network or Fetch Error: ${error.message}`);
    }
}

async function handleResponse<T>(response: Response): Promise<WihResponse<T>> {
    const status = response.status;

    if (status >= 200 && status < 300) {

        const body = await response.json();
        return ({
            status: response.status,
            hasError: false,
            error: null,
            refreshFailed: false,
            response: body as T
        });
    }

    const message = await response.text();
    const errorResponse: WihResponse<T> = {
        status: response.status,
        hasError: true,
        error: message || response.statusText,
        refreshFailed: false
    };

    throw new WihApiError<T>(`HTTP Error ${response.status}: ${message || response.statusText}`, errorResponse);
}

function getUri(baseUrl : string, endpoint: string, version: number = 1): string {
    return `${baseUrl}/api/v${version}/${endpoint}`;
}

export class WihApiError<T> extends Error {
    response: WihResponse<T>;

    constructor(message: string, response: WihResponse<T>) {
        super(message);
        this.name = "ApiError";
        this.response = response;
    }
}