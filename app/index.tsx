import {useRouter} from "expo-router";
import {useSession} from "@/components/auth/context";
import {useEffect} from "react";

export default function Index() {
    const router = useRouter();
    const { session, isSessionLoading } = useSession();

    useEffect(() => {
        if (isSessionLoading) return;

        if (session) {
            router.replace("/protected");
        } else {
            router.replace("/auth/login");
        }
    }, [session, isSessionLoading]);

    return null;
}