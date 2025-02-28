import {Tokens} from "@/constants/WihTypes/Auth";
import {ApiConfig} from "@/components/appContexts/ConfigContext";
import {Endpoints} from "@/constants/endpoints";
import {WihFetchBuilder} from "@/helper/fetch/WihFetchBuilder";

let refreshJwtTokenQueue: Promise<Tokens | null> | null = null;

export async function refreshJwtToken(
    refreshToken: string,
    config: ApiConfig,
    onNewTokens?: (newTokens: Tokens | null) => void
): Promise<Tokens | null> {
    if (!refreshJwtTokenQueue) {
        refreshJwtTokenQueue = (async () => {
            const tokens = refresh(refreshToken, config, onNewTokens);
            refreshJwtTokenQueue = null;
            return tokens;
        })();
    }
    return refreshJwtTokenQueue;
}

async function refresh(
    refreshToken: string,
    config: ApiConfig,
    onNewTokens?: (newTokens: Tokens | null) => void
): Promise<Tokens | null> {

    const response = await new WihFetchBuilder(config)
        .setEndpoint(Endpoints.auth.refresh)
        .setMethod("POST")
        .addCustomHeader("RefreshToken", refreshToken)
        .fetch<Tokens>();

    if (!response.isValid()) {
        return null;
    }

    onNewTokens && onNewTokens(response.data!);
    return response.data!;
}