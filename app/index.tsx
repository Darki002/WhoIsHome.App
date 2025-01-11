import {useSession} from "@/components/appContexts/AuthContext";
import {Redirect} from "expo-router";
import {isInvalidSession} from "@/helper/sessionHelper";
import {useApiConfig} from "@/components/appContexts/ConfigContext";

export default function Index() {
    const {config, isApiConfigLoading} = useApiConfig();
    const {session, isSessionLoading} = useSession();

    if (isSessionLoading || isApiConfigLoading) {
        return null;
    }

    if(!config || !config.apikey || !config.baseUri){
        return <Redirect href="/config"/>
    }

    if (isInvalidSession(session)) {
        return <Redirect href="/auth/login"/>
    }

    return <Redirect href="/protected/(tabs)"/>
}