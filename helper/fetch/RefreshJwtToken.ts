import {Tokens} from "@/constants/WihTypes/Auth";
import {ApiConfig} from "@/components/appContexts/ConfigContext";
import {Endpoints} from "@/constants/endpoints";
import {WihApiError, WihResponse} from "@/helper/fetch/WihFetch";
import {buildUrl} from "@/helper/fetch/WihUrlBuilder";

let refreshJwtTokenQueue: Promise<Tokens | null> | null = null;

export async function refreshJwtToken(
    refreshToken: string,
    config: ApiConfig,
    onNewTokens?: (newTokens: Tokens | null) => void
): Promise<Tokens | null> {
    if (!refreshJwtTokenQueue) {
        refreshJwtTokenQueue = (async () => {
            return refresh(refreshToken, config, onNewTokens);
        })();
    }
    return refreshJwtTokenQueue;
}

async function refresh(
    refreshToken: string,
    config: ApiConfig,
    onNewTokens?: (newTokens: Tokens | null) => void
): Promise<Tokens | null> {
    try {
        const uri = buildUrl(config.baseUri!, Endpoints.auth.refresh);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("X-API-KEY", config.apikey!);
        headers.append("RefreshToken", refreshToken);

        const response = await fetch(uri, {
            method: "POST",
            mode: "cors",
            headers: headers
        });

        const newTokens = await handleResponse<Tokens>(response);
        onNewTokens && onNewTokens(newTokens.response);
        return newTokens.response;
    } catch (error: any) {
        onNewTokens && onNewTokens(null);
        return null;
    } finally {
        refreshJwtTokenQueue = null;
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
        response: null,
        hasError: true,
        error: message || response.statusText,
        refreshFailed: false
    };

    throw new WihApiError<T>(`HTTP Error ${response.status}: ${message || response.statusText}`, errorResponse);
}
