import {useMemo} from "react";

export interface ApiConfig {
    baseUri: string | undefined;
    apikey: string | undefined;
}

export function useApiConfig() : ApiConfig {
    return useMemo(() => {
        return {
            baseUri: process.env.EXPO_PUBLIC_API_BASE_URI,
            apikey: process.env.EXPO_PUBLIC_API_KEY
        }
    }, []);
}