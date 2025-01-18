import {Redirect, Stack, useNavigation, useRouter} from 'expo-router';
import 'react-native-reanimated';
import {useSession} from '@/components/appContexts/AuthContext';
import React, {useEffect} from "react";
import {isInvalidSession} from "@/helper/sessionHelper";
import WihView from "@/components/WihView";
import WihLoading from "@/components/WihLoading";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

const ProtectedLayout = () => {
    const router = useRouter();
    const theme = useWihTheme();
    const {session, isSessionLoading} = useSession();

    useEffect(() => {
        if (!isSessionLoading && isInvalidSession(session)) {
            router.replace("/auth/login");
        }
    }, [session, isSessionLoading]);

    if (isSessionLoading) {
        return (
            <WihView center="full">
                <WihLoading/>
            </WihView>
        );
    }

    if(isInvalidSession(session)){
        router.dismissAll();
        router.replace("/auth/login");
        return null;
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
            <Stack.Screen name="event" options={{headerShown: false}}/>
        </Stack>
    );
}

export default ProtectedLayout;