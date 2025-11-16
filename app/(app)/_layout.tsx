import { Stack, useRouter} from 'expo-router';
import 'react-native-reanimated';
import {useSession} from '@/components/appContexts/AuthContext';
import React, {useEffect} from "react";
import {isInvalidSession} from "@/helper/sessionHelper";
import {WihLoadingView} from "@/components/WihComponents/feedback/WihLoading";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useWihUser} from "@/components/appContexts/WihUserContext";
import {registerForPushNotificationsAsync} from "@/helper/WihPushNotification";
import {usePushTokenSync} from "@/hooks/usePushTokenSync";

const AppLayout = () => {
    const router = useRouter();
    const theme = useWihTheme();

    const {session, isSessionLoading} = useSession();
    const {isUserLoading} = useWihUser();

    useEffect(() => {
        if (!isSessionLoading && isInvalidSession(session)) {
            router.replace("/auth/login");
        }
    }, [session, isSessionLoading]);

    const {syncPushToken} = usePushTokenSync();
    useEffect(() => {
        if(isSessionLoading){
            return;
        }

        const registerAndSync = async () => {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                await syncPushToken(token);
            }
        };
        registerAndSync();
    }, [isSessionLoading]);

    if (isSessionLoading || isUserLoading) {
        return <WihLoadingView />
    }

    const screenOptions = {
        contentStyle: {
            backgroundColor: theme.background
        }
    };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="user/[id]" options={{presentation: "modal", title: "Unknown", headerStyle: {backgroundColor: theme.background}, headerTintColor: theme.text}} />
            <Stack.Screen name="createFlow" options={{headerShown: false}} />
            <Stack.Screen name="event" options={{headerShown: false}}/>
        </Stack>
    );
}

export default AppLayout;