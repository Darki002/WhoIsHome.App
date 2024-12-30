import {useFonts} from 'expo-font';
import {Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useThemeColor} from '@/hooks/useThemeColor';
import {Platform, useColorScheme} from 'react-native';
import {ThemeProvider} from '@react-navigation/native';
import {DarkTheme, LightTheme} from '@/constants/Colors';
import {SessionProvider, useSession} from '@/components/auth/context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const backgroundColor = useThemeColor("background");
    const colorScheme = useColorScheme();

    const router = useRouter();
    const segments = useSegments();
    const {session, isSessionLoading} = useSession();

    const [loaded] = useFonts({
        Roboto: require('../assets/fonts/Roboto-Black.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded || isSessionLoading) {
        return null;
    }

    const isAuthPath = segments[0] === "auth";
    if (!session || !session.jwtToken || !session.refreshToken && !isAuthPath) {
        router.replace("/auth/login");
    }

    const isWeb = Platform.OS === "web";
    const screenOptions = {
        ...(isWeb ? {} : {contentStyle: {backgroundColor}})
    };

    return (
        <SessionProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
                <Stack screenOptions={screenOptions}>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="user/[id]" options={{presentation: "modal", title: "Unknown"}}/>
                    <Stack.Screen name="event" options={{headerShown: false}}/>
                    <Stack.Screen name="auth" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found"/>
                </Stack>
            </ThemeProvider>
        </SessionProvider>
    );
}

export default RootLayout;