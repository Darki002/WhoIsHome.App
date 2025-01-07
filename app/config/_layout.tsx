import {Stack} from "expo-router";
import React from "react";
import {useApiConfig} from "@/components/config/context";
import {WihTitle} from "@/components/WihText";

export default function ConfigLayout() {
    const {isApiConfigLoading} = useApiConfig();

    if (isApiConfigLoading) {
        return <WihTitle>Loading...</WihTitle>
    }

    return (
        <Stack screenOptions={{headerShown: false, title: "Test"}}>
            <Stack.Screen name="index"/>
        </Stack>
    )
}