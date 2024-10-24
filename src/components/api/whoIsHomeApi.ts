export type TokensProps = {
    session: string;
    refresh: string;
}

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE";
    tokens: TokensProps | null;
    version: number;
    onNewTokens: (newTokens: TokensProps) => void;
}

export const wihFetch = async ({ endpoint, method, tokens, version = 1, onNewTokens }: WihFetchProps): Promise<Response | undefined> => {

    // Add payload (body) and add it to the request

    try {
        const responese = await authFetch({ endpoint, method, tokens, version, onNewTokens });

        // Check status code and throw with message so UI can react to it

        return await responese.json();
    }
    catch (e) {
        if (tokens) {
            const newTokens: TokensProps = await refreshJwtToken(tokens.refresh);
            onNewTokens(newTokens);

            const responese = await authFetch({ endpoint, method, tokens: newTokens, version, onNewTokens });

            // Check status code and throw with message so UI can react to it

            return await responese.json();
        }
        else {
            throw e;
        }
    }
}

async function authFetch({ endpoint, method, tokens, version }: WihFetchProps): Promise<any> {
    const uri = `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/${version}/${endpoint}`;
    const headers: { [key: string]: string } = {
        "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY!,
        ...(tokens ? { "Authentication": `Bearer ${tokens?.session}` } : {})
    }

    const response = await fetch(uri, {
        method,
        headers
    });
    return await response.json();
}

async function refreshJwtToken(refreshToken: string): Promise<TokensProps> {
    const uri = `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/v1/refresh`;
    const header: { [key: string]: string } = {
        "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY!,
        "Refresh-Token": refreshToken
    }

    const response = await fetch(uri, {
        method: "POST",
        headers: header
    });
    const responseText = await response.json();
    return ({
        session: responseText.Token,
        refresh: responseText.RefreshToken
    })
}