import {Tokens} from "@/constants/WihTypes/Auth";
import {ApiConfig} from "@/hooks/useApiConfig";
import {refreshJwtToken} from "@/helper/fetch/RefreshJwtToken";
import {WihResponse} from "@/helper/fetch/WihResponse";
import {WihLogger} from "@/helper/WihLogger";

export type WihApiMethods = "GET" | "POST" | "DELETE" | "PATCH";
export type OnNewTokenCallback = (tokens: (Tokens | undefined | null)) => void;

// TODO: fix error handling with messages in ui
export class WihFetchBuilder {
    private readonly config: ApiConfig;
    private tokens?: Tokens;
    private onNewTokens?: OnNewTokenCallback;

    private endpoint: string = "";
    private apiVersion: number = 1;
    private method: WihApiMethods = "GET";

    private headers = new Headers();
    private body?: any;

    constructor(config: ApiConfig, tokens?: Tokens) {
        this.config = config;
        this.tokens = tokens;
    }

    setEndpoint(endpoint: string) {
        this.endpoint = endpoint;
        return this;
    }

    setMethod(method?: WihApiMethods) {
        if(!method) return this;
        this.method = method;
        return this;
    }

    setBody(body?: any) {
        this.body = body;
        return this;
    }

    setVersion(version?: number) {
        if(!version) return this;
        this.apiVersion = version;
        return this;
    }

    addNewTokenListener(onNewTokens?: (tokens: (Tokens | undefined | null)) => void) {
        this.onNewTokens = onNewTokens;
        return this;
    }

    addCustomHeader(key: string, value: string){
        this.headers.append(key, value);
        return this;
    }

    private buildHeaders() {
        this.headers.append("Content-Type", "application/json");

        if(this.config.apikey){
            this.headers.append("X-API-KEY", this.config.apikey);
        } else {
            WihLogger.warn(WihFetchBuilder.name, `Attempting a request without a API Key! ${this.config.apikey}`);
        }

        if (this.tokens) {
            this.headers.append("Authorization", `Bearer ${this.tokens.jwtToken}`);
        }
    }

    private buildUrl(): string {
        return `${this.config.baseUri}/api/v${this.apiVersion}/${this.endpoint}`;
    }

    async fetch<T>(): Promise<WihResponse<T>> {
        this.buildHeaders();
        const uri = this.buildUrl();

        if (this.method === "GET" && this.body) {
            WihLogger.warn(WihFetchBuilder.name, `Attempting a GET request with a body for ${this.endpoint}`);
        }

        WihLogger.debug(WihFetchBuilder.name, `Request ${this.method} ${uri}`);

        try {
            const response = await fetch(uri, {
                method: this.method,
                headers: this.headers,
                mode: "cors",
                body: this.body ? JSON.stringify(this.body) : undefined
            });

            const apiResponse = await WihResponse.fromResponse<T>(response);

            if(!apiResponse.isValid()){
                if(apiResponse.status === 401 && this.tokens?.refreshToken){
                    return this.refresh<T>();
                }
                return this.retry<T>();
            }

            return apiResponse;
        } catch (error: any) {
            WihLogger.error(WihFetchBuilder.name, error);
            return WihResponse.error<T>(error);
        }
    }

    private async refresh<T>(): Promise<WihResponse<T>> {
        const newTokens = await refreshJwtToken(this.tokens?.refreshToken!, this.config, this.onNewTokens);
        if (typeof newTokens === "string") {
            WihLogger.info(WihFetchBuilder.name, `Refresh failed! | Message: ${newTokens}`);
            return WihResponse.fail<T>(`Refresh token expired, re-authentication required. | Message ${newTokens}`, 401, true);
        }

        this.tokens = newTokens;
        this.headers.delete("Authorization");
        this.headers.append("Authorization", `Bearer ${this.tokens.jwtToken}`);
        return this.retry<T>();
    }

    private async retry<T>(): Promise<WihResponse<T>> {
        const uri = this.buildUrl();

        try {
            const response = await fetch(uri, {
                method: this.method,
                headers: this.headers,
                mode: "cors",
                body: this.body ? JSON.stringify(this.body) : undefined
            });

            return await WihResponse.fromResponse<T>(response);
        } catch (error: any) {
            WihLogger.error(WihFetchBuilder.name, error);
            return WihResponse.error<T>(error);
        }
    }
}