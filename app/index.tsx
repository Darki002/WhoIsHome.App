import {useSession} from "@/components/auth/context";
import {Redirect} from "expo-router";
import {isInvalidSession} from "@/helper/sessionHelper";
import {useApiConfig} from "@/components/config/context";

export default function Index() {
    const {config, isLoading} = useApiConfig();
    const {session, isSessionLoading} = useSession();

    if (isSessionLoading || isLoading) {
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