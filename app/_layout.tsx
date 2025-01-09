import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';
import i18n from "@/helper/i18n"
import {Platform, useColorScheme} from 'react-native';
import {theme} from '@/constants/Colors';
import {SessionProvider} from '@/components/auth/context';
import {ApiConfigProvider, useApiConfig} from "@/components/config/context";
import {I18nextProvider} from "react-i18next";
import {ThemeProvider} from "@rneui/themed";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
        return null;
    }

    const isWeb = Platform.OS === "web";
    const screenOptions = {
        ...(isWeb ? {} : {
            contentStyle: {
                backgroundColor: colorScheme === "dark"
                    ? theme.darkColors?.background
                    : theme.lightColors?.background
            }
        })
    };

    return (
        <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
                <ApiConfigProvider>
                    <SessionProvider>
                        <Stack screenOptions={screenOptions}>
                            <Stack.Screen name="protected" options={{headerShown: false}}/>
                            <Stack.Screen name="auth" options={{headerShown: false}}/>
                            <Stack.Screen name="config" options={{headerShown: false}}/>
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                    </SessionProvider>
                </ApiConfigProvider>
            </ThemeProvider>
        </I18nextProvider>
    );
}

export default RootLayout;