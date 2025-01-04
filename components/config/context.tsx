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
    isLoading: boolean;
}>({
    setConfig: async () => null,
    config: null,
    isLoading: false
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

    useEnvConfigs(isLoading, setBaseUri, setApikey);

    useEffect(() => {
        if (!isLoading && (!baseUri || !apikey)) {
            router.replace("/config");
        }
    }, [isLoading, baseUri, apikey, router]);

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
                config: {baseUri, apikey},
                isLoading
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

function useEnvConfigs(isLoading: boolean, setBaseUri: (value: (string | null)) => void, setApikey: (value: (string | null)) => void){
    const [isApplied, setIsApplied] = useState<boolean>(false);

    useEffect(() => {
        if(isApplied || isLoading) return;

        if (process.env.EXPO_PUBLIC_USE_ENV_CONFIG === "true") {
            console.info("Applying ENV configurations");
            const envBaseUri = process.env.EXPO_PUBLIC_API_BASE_URI ?? null;
            const envApiKey = process.env.EXPO_PUBLIC_API_KEY ?? null;

            if (envBaseUri) setBaseUri(envBaseUri);
            if (envApiKey) setApikey(envApiKey);
        }

        if (process.env.EXPO_PUBLIC_CLEAR_CONFIG === "true") {
            console.info("Clear API config from Storage");
            setBaseUri(null);
            setApikey(null);
        }

        setIsApplied(true);
    }, [setBaseUri, setApikey, isLoading]);
}