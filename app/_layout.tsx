import {useFonts} from 'expo-font';
import {Redirect, Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useThemeColor} from '@/hooks/useThemeColor';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider} from '@react-navigation/native';
import {DarkTheme, LightTheme} from '@/constants/Colors';
import {SessionProvider} from '@/components/auth/context';
import {ApiConfigProvider, useApiConfig} from "@/components/config/context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const backgroundColor = useThemeColor("background");
    const colorScheme = useColorScheme();
    const {isLoading} = useApiConfig();

    const [loaded] = useFonts({
        Roboto: require('../assets/fonts/Roboto-Black.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded || isLoading) {
        return null;
    }

    const isWeb = Platform.OS === "web";
    const screenOptions = {
        ...(isWeb ? {} : {contentStyle: {backgroundColor}})
    };

    return (
        <SessionProvider>
            <ApiConfigProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
                    <Stack screenOptions={screenOptions}>
                        <Stack.Screen name="protected" options={{headerShown: false}}/>
                        <Stack.Screen name="auth" options={{headerShown: false}}/>
                        <Stack.Screen name="config" options={{headerShown: false}}/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                </ThemeProvider>
            </ApiConfigProvider>
        </SessionProvider>
    );
}

export default RootLayout;