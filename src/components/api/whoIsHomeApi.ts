export type KeyValuePaire = { [key: string]: string };

export type WihFetchError = "Unauthorized" | "Refresh Failed" | "Inernal" | "Unknown";

export type TokensProps = {
    Token: string;
    RefreshToken: string;
}

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    tokens?: TokensProps;
    version?: number;
    body?: KeyValuePaire;
    onNewTokens?: (newTokens: TokensProps | null) => void;
}

export interface WihResponsePops<T> {
    status: number;
    hasError: boolean;
    error: WihFetchError | null;
    errorMessage: any;
    response: T;
}

export const wihFetch = async <TBody>({ endpoint, method = "GET", body, tokens, version = 1, onNewTokens }: WihFetchProps): Promise<WihResponsePops<TBody | null>> => {
    let responese = await authFetch<TBody>(endpoint, method, body, tokens, version);

    if (responese.hasError && tokens) {
        const newTokens = await refreshJwtToken(tokens.RefreshToken);

        if (newTokens.hasError) {
            onNewTokens!(null);
            return newTokens as WihResponsePops<null>;
        }

        onNewTokens!(newTokens.response);
        responese = await authFetch<TBody>(endpoint, method, body, newTokens.response!, version);
        return responese;
    }

    return responese;
}

async function authFetch<T>(endpoint: string, method: string, body: KeyValuePaire | undefined, tokens: TokensProps | undefined, version: number): Promise<WihResponsePops<T | null>> {
    const uri = `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/v${version}/${endpoint}`;
    const headers: { [key: string]: string } = {
        "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY!,
        ...(tokens ? { "Authorization": `Bearer ${tokens?.Token}` } : {})
    }

    console.info(`Fetch for ${uri}`)

    const response = await fetch(uri, {
        method,
        headers,
        body: JSON.stringify(body)
    });
    return await handleResponse(response);
}

async function refreshJwtToken(refreshToken: string): Promise<WihResponsePops<TokensProps | null>> {
    const uri = `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/v1/refresh`;
    const header: KeyValuePaire = {
        "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY!,
        "RefreshToken": refreshToken
    }

    const response = await fetch(uri, {
        method: "POST",
        headers: header
    });

    return await handleResponse<TokensProps>(response);
}

async function handleResponse<T>(response: Response): Promise<WihResponsePops<T | null>> {

    if (response.status === 200) {

        const body = await response.json();
        return ({
            status: response.status,
            hasError: false,
            error: null,
            errorMessage: null,
            response: body as T
        });
    }

    return ({
        status: response.status,
        hasError: true,
        error: stringifyErrorStatus(response.status),
        errorMessage: response.body,
        response: null
    });
}

function stringifyErrorStatus(status: number): WihFetchError {
    if (status === 401)
        return "Unauthorized"
    if (status >= 500 && status < 600)
        return "Inernal"
    return "Unknown"
}