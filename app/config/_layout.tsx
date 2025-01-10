import {Stack} from "expo-router";
import React from "react";
import {useApiConfig} from "@/components/config/context";
import {WihTitle} from "@/components/WihText";
import WihLoading from "@/components/WihLoading";

export default function ConfigLayout() {
    const {isApiConfigLoading} = useApiConfig();

    if (isApiConfigLoading) {
        return <WihLoading />
    }

    return (
        <Stack screenOptions={{headerShown: false, title: "Test"}}>
            <Stack.Screen name="index"/>
        </Stack>
    )
}