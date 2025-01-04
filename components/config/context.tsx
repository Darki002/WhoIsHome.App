import {createContext, type PropsWithChildren, useContext} from "react";
import {useStorageState} from "@/hooks/useStorageState";

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
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function ApiConfigProvider({ children }: PropsWithChildren){
    const [[isLoadingBaseUri, baseUri], setBaseUri] = useStorageState('baseUri');
    const [[isLoadingApikey, apikey], setApikey] = useStorageState('baseUri');

    const isLoading = isLoadingBaseUri || isLoadingApikey;

    return(
        <ApiContext.Provider
        value={{
            setConfig: async (config: ApiConfig) =>  {
                if (!config.baseUri || !config.apikey) return "Invalid Configuration";

                setBaseUri(config.baseUri);
                setApikey(config.apikey);

                const result = await checkConfig({apikey, baseUri});
                return result ? null : "Config did not work";
            },
            config: baseUri && apikey ? {baseUri, apikey} : null,
            isLoading
        }}>
            {children}
        </ApiContext.Provider>
    )
}

async function checkConfig({apikey, baseUri} : ApiConfig) : Promise<boolean> {
    const headers = new Headers();
    headers.append("X-API-KEY", apikey!);

    try{
        const response = await fetch(`${baseUri}/api/v1/HealthCheck`, {
            method: "GET",
            headers: headers,
            mode: "cors",
        });

        return response.ok;
    }
    catch (e : any) {
        console.log(`Error while checking config: ${e.message}`)
        return false;
    }
}