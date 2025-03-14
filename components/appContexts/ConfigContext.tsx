import React, {createContext, type PropsWithChildren, useContext, useEffect} from "react";
import {useStorageState} from "@/hooks/useStorageState";
import {useRouter} from "expo-router";
import {WihLogger} from "@/helper/WihLogger";

export interface ApiConfig {
    baseUri: string | null;
    apikey: string | null;
}

const ApiContext = createContext<{
    setConfig: (config: ApiConfig) => Promise<string | null>;
    config: ApiConfig | null;
    isApiConfigLoading: boolean;
    isConfigured: boolean;
}>({
    setConfig: async () => null,
    config: null,
    isApiConfigLoading: true,
    isConfigured: false,
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
        WihLogger.debug(`(Config Context) isLoading = ${isLoading} | apikey = ${config?.apikey} | url = ${config?.baseUri}`);
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
                isApiConfigLoading: isLoading,
                isConfigured: config?.apikey != null && config.baseUri != null
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
        WihLogger.error(e);
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

    useEffect(() => {
        if(__DEV__ && isEnvConfigActive()){
            console.info("Use ENV Variable configs!");
        }
    }, []);

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

    if(isEnvConfigActive()) {
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

function isEnvConfigActive(){
    return process.env.EXPO_PUBLIC_USE_ENV_CONFIG?.toLowerCase() === "true";
}