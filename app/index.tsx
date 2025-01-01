import {useSession} from "@/components/auth/context";
import {Redirect} from "expo-router";
import {isInvalidSession} from "@/helper/sessionHelper";

export default function Index() {
    const { session, isSessionLoading } = useSession();

    if(isSessionLoading) {
        return null;
    }

    if(isInvalidSession(session)){
        return <Redirect href="/auth/login" />
    }

    return <Redirect href="/protected/(tabs)" />
}