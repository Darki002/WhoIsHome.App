import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect, useRef} from 'react';
import 'react-native-reanimated';
import i18n from "@/helper/i18n"
import {useColorScheme} from 'react-native';
import {SessionProvider} from '@/components/appContexts/AuthContext';
import {ApiConfigProvider} from "@/components/appContexts/ConfigContext";
import {I18nextProvider} from "react-i18next";
import {WihThemeProvider} from "@/components/appContexts/WihThemeProvider";
import {Colors} from "@/constants/Colors";
import {WihLoading} from "@/components/WihComponents/feedback/WihLoading";
import {StatusBar} from "expo-status-bar";
import * as Sentry from '@sentry/react-native';
import {WihLogger} from "@/helper/WihLogger";
import {WihUserProvider} from "@/components/appContexts/WihUserContext";
import {registerForPushNotificationsAsync} from "@/helper/WihPushNotification";
import * as Notifications from 'expo-notifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
try {
    SplashScreen.preventAutoHideAsync();
} catch (error: any) {
    WihLogger.error("RootLayout", error);
}

Sentry.init({
    dsn: 'https://333861c10d47b85ce546c88ff117623f@o4508785521786880.ingest.de.sentry.io/4508785524342864',
    enabled: !__DEV__,
    debug: __DEV__
});

const RootLayout = () => {
    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        Roboto: require('../assets/fonts/Roboto-Black.ttf'),
    });

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            WihLogger.log(RootLayout.name, notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            WihLogger.log(RootLayout.name, response);
        });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        const hideSplashScreen = async () => {
            try {
                if (loaded) {
                    await SplashScreen.hideAsync();
                }
            } catch (error: any) {
                WihLogger.warn(RootLayout.name, error);
            }
        };

        hideSplashScreen();
    }, [loaded]);

    if (!loaded) {
        return <WihLoading/>;
    }

    const screenOptions = {
        contentStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background
        }
    };

    return (
        <I18nextProvider i18n={i18n}>
            <WihThemeProvider>
                <ApiConfigProvider>
                    <SessionProvider>
                        <WihUserProvider>
                            <StatusBar
                                style={colorScheme === 'dark' ? 'light' : 'dark'}
                                backgroundColor={Colors[colorScheme ?? "light"].background}
                            />
                            <Stack screenOptions={screenOptions}>
                                <Stack.Screen name="(app)" options={{headerShown: false}}/>
                                <Stack.Screen name="auth" options={{headerShown: false}}/>
                                <Stack.Screen name="config" options={{headerShown: false}}/>
                                <Stack.Screen name="+not-found"/>
                            </Stack>
                        </WihUserProvider>
                    </SessionProvider>
                </ApiConfigProvider>
            </WihThemeProvider>
        </I18nextProvider>
    );
}

export default RootLayout;