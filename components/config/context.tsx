import {createContext, type PropsWithChildren, useContext} from "react";
import {useStorageState} from "@/hooks/useStorageState";

export interface ApiConfig {
    baseUri: string | null;
    apikey: string | null;
}

const ApiContext = createContext<{
    setConfig: (config: ApiConfig) => void;
    config: ApiConfig | null;
    isLoading: boolean;
}>({
    setConfig: () => null,
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
            setConfig: (config: ApiConfig) =>  {
                if (!config.baseUri || !config.apikey) return "Invalid Configuration";

                setBaseUri(config.baseUri);
                setApikey(config.apikey);
            },
            config: baseUri && apikey ? {baseUri, apikey} : null,
            isLoading
        }}>
            {children}
        </ApiContext.Provider>
    )
}