import {createContext, type PropsWithChildren} from "react";
import {useStorageState} from "@/components/auth/useStorageState";

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