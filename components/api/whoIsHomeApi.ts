export type KeyValuePaire = { [key: string]: string };

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
    error: string | null;
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
    const uri = getUri(endpoint, version);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("X-API-KEY", process.env.EXPO_PUBLIC_API_KEY!);

    if(tokens){
        headers.append("Authorization", `Bearer ${tokens?.Token}`);
    }

    console.info(`Fetch for ${uri}`)

    try {
        const response = await fetch(uri, {
            method: method,
            headers: headers,
            mode: "cors",
            body: JSON.stringify(body)
        });

        return await handleResponse(response);
    }
    catch (error: any) {
        console.error(`Request failed: ${error.message}`);
        return ({
            status: 0,
            hasError: true,
            error: error.message,
            response: null
        });
    }
}

async function refreshJwtToken(refreshToken: string): Promise<WihResponsePops<TokensProps | null>> {
    const uri = getUri("refresh");

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

        return await handleResponse<TokensProps>(response);
    }
    catch (error: any) {
        console.error(`Request failed: ${error.message}`);
        return ({
            status: 0,
            hasError: true,
            error: error.message,
            response: null
        });
    }
}

async function handleResponse<T>(response: Response): Promise<WihResponsePops<T | null>> {

    if (response.status === 200) {

        const body = await response.json();
        return ({
            status: response.status,
            hasError: false,
            error: null,
            response: body as T
        });
    }

    console.warn(`Request with error Status "${response.statusText}" - ${response.status}`);

    switch (response.status) {
        case 401:
            console.error(response.body);
            return ({
                status: response.status,
                hasError: true,
                error: response.statusText,
                response: null
            });
        default:
            return ({
                status: response.status,
                hasError: true,
                error: response.statusText,
                response: null
            });
    }
}

function getUri(endpoint: string, version: number = 1) : string {
    return `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/v${version}/${endpoint}`;
}