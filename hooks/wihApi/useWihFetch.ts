import {useApiConfig} from "@/components/appContexts/ConfigContext";
import {useSession} from "@/components/appContexts/AuthContext";
import {Tokens} from "@/constants/WihTypes/Auth";
import {WihResponse} from "@/helper/fetch/WihResponse";
import {WihFetchBuilder} from "@/helper/fetch/WihFetchBuilder";
import {WihLogger} from "@/helper/WihLogger";

export interface WihFetchProps {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH";
    version?: number;
}

const useWihFetch = <T>(props: WihFetchProps) => {
    const {config} = useApiConfig();
    const {session, onNewSession, signOut} = useSession();

    function onNewTokens(tokens: Tokens | undefined | null) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    return async (body?: T): Promise<WihResponse<T> | null> => {
        if (!session) {
            WihLogger.warn(`Skip Request ${props.endpoint} due to missing session!`);
            return null;
        }

        if(!config?.apikey){
            WihLogger.warn(`Skip Request ${props.endpoint} due to missing API Key!`);
            return null;
        }

        const response = await new WihFetchBuilder(config, session)
            .setEndpoint(props.endpoint)
            .setMethod(props.method)
            .setVersion(props.version)
            .setBody(body)
            .addNewTokenListener(onNewTokens)
            .fetch<T>();

        if(response.isValid()) return response;

        if (response.refreshFailed) {
            signOut();
        }

        return response;
    }
}

export default useWihFetch;
