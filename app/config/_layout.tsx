import {Stack} from "expo-router";
import React from "react";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import {WihLoading} from "@/components/WihComponents/feedback/WihLoading";
import WihView from "@/components/WihComponents/view/WihView";

export default function ConfigLayout() {
    const {isApiConfigLoading} = useApiConfig();

    if (isApiConfigLoading) {
        return (
            <WihView center="full">
                <WihLoading/>
            </WihView>
        );
    }

    return (
        <Stack screenOptions={{headerShown: false, title: "Test"}}>
            <Stack.Screen name="index"/>
        </Stack>
    )
}