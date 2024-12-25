import {useThemeColor} from "@/hooks/useThemeColor";
import {IonIcon, MateriaIcon} from '@/components/WihIcon';
import {useRouter, Tabs} from "expo-router";
import React, {useEffect} from "react";
import {useSession} from "@/components/auth/context";
import {WihTitle} from "@/components/WihText";

const TabIconProps = {
    size: 28,
    style: {
        marginBottom: -3
    }
}

const AuthLayout = () => {
    const {session, isLoading} = useSession();
    const tint = useThemeColor("tint");
    const router = useRouter();
    const backgroundColor = useThemeColor('background');

    useEffect(() => {
        if (session && session.jwtToken && session.refreshToken) {
            router.replace("/");
        }
    }, [session]);

    if (isLoading) {
        return <WihTitle>Loading...</WihTitle>
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: tint,
                headerShown: false,
                tabBarStyle: {backgroundColor: backgroundColor}
            }}>
            <Tabs.Screen
                name="login"
                options={{
                    title: "Login",
                    tabBarIcon: ({color, focused}) => (
                        <IonIcon name={focused ? 'home' : 'home-outline'} color={color} {...TabIconProps} />
                    )
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    title: "Register",
                    tabBarIcon: ({color, focused}) => (
                        <MateriaIcon name={focused ? 'add-circle' : 'add-circle-outline'}
                                     color={color} {...TabIconProps} />
                    )
                }}
            />
        </Tabs>
    );
}

export default AuthLayout;
