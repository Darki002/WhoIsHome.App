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
import {isRunningInExpoGo} from "expo";
import * as Sentry from '@sentry/react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
    dsn: 'YOUR DSN HERE', // TODO
    debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
    integrations: [navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
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

// Wrap the Root Layout route component with `Sentry.wrap` to capture gesture info and profiling data.
export default Sentry.wrap(RootLayout);