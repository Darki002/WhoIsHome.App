import {createContext, type PropsWithChildren, useContext, useEffect} from "react";
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
    const {isLoading, config, setConfig} = useConfigs();

    useEffect(() => {
        if (!isLoading && (!config?.baseUri || !config?.apikey)) {
            router.replace("/config");
            return;
        }
    }, [isLoading, config, router]);

    return (
        <ApiContext.Provider
            value={{
                setConfig: async (config: ApiConfig) => {
                    if (!config.baseUri || !config.apikey) return "Invalid Configuration";
                    const isValid = await checkConfig(config);
                    if(!isValid){
                        return "Config did not work";
                    }

                    setConfig?.setBaseUri(config.baseUri);
                    setConfig?.setApikey(config.apikey);
                    return null;
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

interface UseConfigHook {
    isLoading: boolean;
    config: ApiConfig | null;
    setConfig?: {
        setApikey: (value: (string | null)) => void;
        setBaseUri: (value: (string | null)) => void;
    }
}

function useConfigs() : UseConfigHook {
    const [[isLoadingBaseUri, baseUri], setBaseUri] = useStorageState('baseUri');
    const [[isLoadingApikey, apikey], setApikey] = useStorageState('apikey');

    if(!__DEV__){
        return {
            isLoading: isLoadingBaseUri || isLoadingApikey,
            config: {baseUri, apikey},
            setConfig: {
                setBaseUri,
                setApikey
            }
        }
    }

    if(process.env.EXPO_PUBLIC_USE_ENV_CONFIG?.toLowerCase() === "true") {
        console.info("Use ENV Variable configs!")
        return {
            isLoading: false,
            config: {
                baseUri: process.env.EXPO_PUBLIC_API_BASE_URI ?? null,
                apikey: process.env.EXPO_PUBLIC_API_KEY ?? null
            }
        }
    }

    return {
        isLoading: isLoadingBaseUri || isLoadingApikey,
        config: {baseUri, apikey},
        setConfig: {
            setBaseUri,
            setApikey
        }
    }
}