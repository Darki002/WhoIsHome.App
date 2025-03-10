import {WihLoadingView} from "@/components/WihComponents/feedback/WihLoading";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import {useSession} from "@/components/appContexts/AuthContext";
import {useWihUser} from "@/components/appContexts/WihUserContext";
import {Redirect} from "expo-router";

export default function Index() {
    const {isApiConfigLoading} = useApiConfig();
    const {isSessionLoading} = useSession();
    const {isUserLoading} = useWihUser();

    if(isApiConfigLoading || isSessionLoading || isUserLoading){
        return <WihLoadingView />
    }

    return <Redirect href="/protected/(tabs)" />
}