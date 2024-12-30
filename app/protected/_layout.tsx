import {Stack, useRouter} from 'expo-router';
import 'react-native-reanimated';
import {useSession} from '@/components/auth/context';
import {useEffect} from "react";
import {Tokens} from "@/constants/WihTypes/Auth";

const ProtectedLayout = () => {
    const router = useRouter();
    const {session, isSessionLoading} = useSession();

    useEffect(() => {
        if (!isSessionLoading && isInvalidSession(session)) {
            router.replace("/auth/login");
        }
    }, [session, isSessionLoading]);

    if (isSessionLoading) {
        return null;
    }

    if(isInvalidSession(session)){
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="user/[id]" options={{presentation: "modal", title: "Unknown"}}/>
            <Stack.Screen name="event" options={{headerShown: false}}/>
        </Stack>
    );
}

function isInvalidSession(session: Tokens | null) : boolean {
    return !session || !session.jwtToken || !session.refreshToken;
}

export default ProtectedLayout;