import {IonIcon, WihMaterialIcon, MaterialCommunityIcon} from '@/components/WihComponents/icon/WihIcon';
import {Tabs} from "expo-router";
import React from "react";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

const TabIconProps = {
    size: 28,
    style: {
        marginBottom: -3
    }
}

const TabsLayout = () => {
    const {t} = useTranslation();
    const theme = useWihTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tint,
                headerShown: false,
                tabBarStyle: { backgroundColor: theme.background }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: t(Labels.tabs.home),
                    tabBarIcon: ({color, focused}) => (
                        <IonIcon name={focused ? 'home' : 'home-outline'} color={color} {...TabIconProps} />
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: t(Labels.tabs.create),
                    tabBarIcon: ({color, focused}) => (
                        <WihMaterialIcon name={focused ? 'add-circle' : 'add-circle-outline'}
                                         color={color} {...TabIconProps} />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t(Labels.tabs.profile),
                    tabBarIcon: ({color, focused}) => (
                        <MaterialCommunityIcon name={focused ? 'account-circle' : 'account-circle-outline'}
                                               color={color} {...TabIconProps} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default TabsLayout;
