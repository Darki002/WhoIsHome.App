export type TokensProps = {
    session: string;
    refresh: string;
}

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST";
    tokens: TokensProps | null;
    version: number;
    onNewTokens: (newTokens: TokensProps) => void;
}

export const wihFetch = async ({ endpoint, method, tokens, version = 1, onNewTokens }: WihFetchProps): Promise<Response> => {

    const uri = `${process.env.EXPO_PUBLIC_API_BASE_URI}/api/${version}/${endpoint}`;
    const header = {
        "X-API-KEY": process.env.EXPO_PUBLIC_API_KEY,
        ...(tokens ? { "Authentication": `Bearer ${tokens?.session}` } : {})
    }

    const response = await fetch(uri, {
        method
    });

    // Try refresh after failure

    return await response.json();
}