import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import {useStorageState} from "@/hooks/useStorageState";
import {useRouter} from "expo-router";

export interface ApiConfig {
    baseUri: string | null;
    apikey: string | null;
}

const ApiContext = createContext<{
    setConfig: (config: ApiConfig) => Promise<string | null>;
    config: ApiConfig | null;
    isApiConfigLoading: boolean;
}>({
    setConfig: async () => null,
    config: null,
    isApiConfigLoading: false
});

export function useApiConfig() {
    const value = useContext(ApiContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <ApiConfigProvider />');
        }
    }

    return value;
}

export function ApiConfigProvider({children}: PropsWithChildren) {
    const router = useRouter();
    const [[isLoadingBaseUri, baseUri], setBaseUri] = useStorageState('baseUri');
    const [[isLoadingApikey, apikey], setApikey] = useStorageState('apikey');

    const isLoading = isLoadingBaseUri || isLoadingApikey;

    useEffect(() => {
        if (!isLoading && (!baseUri || !apikey)) {
            router.replace("/config");
        }
    }, [isLoading, baseUri, apikey, router]);

    const {isUsingEnvConfig, envConfig} = useEnvConfigs();

    const config = isUsingEnvConfig ? envConfig : {baseUri, apikey};

    return (
        <ApiContext.Provider
            value={{
                setConfig: async (config: ApiConfig) => {
                    if (!config.baseUri || !config.apikey) return "Invalid Configuration";

                    setBaseUri(config.baseUri);
                    setApikey(config.apikey);

                    const result = await checkConfig(config);
                    return result ? null : "Config did not work";
                },
                config: config,
                isApiConfigLoading: isLoading
            }}>
            {children}
        </ApiContext.Provider>
    )
}

async function checkConfig({apikey, baseUri}: ApiConfig): Promise<boolean> {
    const headers = new Headers();
    headers.append("X-API-KEY", apikey!);

    try {
        const response = await fetch(`${baseUri}/api/v1/HealthCheck`, {
            method: "GET",
            headers: headers,
            mode: "cors",
        });

        return response.ok;
    } catch (e: any) {
        console.log(`Error while checking config: ${e.message}`)
        return false;
    }
}

function useEnvConfigs() : {isUsingEnvConfig: boolean, envConfig: ApiConfig | null}{
    if(!__DEV__){
        return {
            isUsingEnvConfig: false,
            envConfig: null
        }
    }

    if(process.env.EXPO_PUBLIC_USE_ENV_CONFIG === "False") {
        return {
            isUsingEnvConfig: false,
            envConfig: null
        }
    }

    return {
        isUsingEnvConfig: true,
        envConfig: {
            baseUri: process.env.EXPO_PUBLIC_API_BASE_URI ?? null,
            apikey: process.env.EXPO_PUBLIC_API_KEY ?? null
        }
    }
}