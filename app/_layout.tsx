import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';
import 'react-native-reanimated';
import i18n from "@/helper/i18n"
import {useColorScheme} from 'react-native';
import {SessionProvider} from '@/components/appContexts/AuthContext';
import {ApiConfigProvider, useApiConfig} from "@/components/appContexts/ConfigContext";
import {I18nextProvider} from "react-i18next";
import {WihThemeProvider} from "@/components/appContexts/WihThemeProvider";
import {Colors} from "@/constants/Colors";
import WihView from "@/components/WihView";
import WihLoading from "@/components/WihLoading";
import {StatusBar} from "expo-status-bar";
import * as Sentry from '@sentry/react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Sentry.init({
    dsn: 'https://333861c10d47b85ce546c88ff117623f@o4508785521786880.ingest.de.sentry.io/4508785524342864',
    debug: __DEV__
});

const RootLayout = () => {
    const colorScheme = useColorScheme();
    const {isApiConfigLoading} = useApiConfig();

    const [loaded] = useFonts({
        Roboto: require('../assets/fonts/Roboto-Black.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded || isApiConfigLoading) {
        return (
            <WihView center="full">
                <WihLoading/>
            </WihView>
        );
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
                        <StatusBar
                            style={colorScheme === 'dark' ? 'light' : 'dark'}
                            backgroundColor={Colors[colorScheme ?? "light"].background}
                        />
                        <Stack screenOptions={screenOptions}>
                            <Stack.Screen name="protected" options={{headerShown: false}}/>
                            <Stack.Screen name="auth" options={{headerShown: false}}/>
                            <Stack.Screen name="config" options={{headerShown: false}}/>
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                    </SessionProvider>
                </ApiConfigProvider>
            </WihThemeProvider>
        </I18nextProvider>
    );
}

export default RootLayout;