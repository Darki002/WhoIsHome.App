import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
try {
    SplashScreen.preventAutoHideAsync();
} catch (error: any) {
    WihLogger.error("RootLayout", error);
}

Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: !__DEV__,
    debug: __DEV__
});

const RootLayout = () => {
    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        Roboto: require('../assets/fonts/Roboto-Black.ttf'),
    });

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