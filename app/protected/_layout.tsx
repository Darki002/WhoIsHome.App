import {Stack, useRouter, useSegments} from 'expo-router';
import 'react-native-reanimated';
import {useSession} from '@/components/auth/context';

const ProtectedLayout = () => {
    const router = useRouter();
    const segments = useSegments();
    const {session, isSessionLoading} = useSession();

    if (isSessionLoading) {
        return null;
    }

    const isAuthPath = segments[0] === "auth";
    if (!isAuthPath && (!session || !session.jwtToken || !session.refreshToken)) {
        router.replace("/auth/login");
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="user/[id]" options={{presentation: "modal", title: "Unknown"}}/>
            <Stack.Screen name="event" options={{headerShown: false}}/>
        </Stack>
    );
}

export default ProtectedLayout;