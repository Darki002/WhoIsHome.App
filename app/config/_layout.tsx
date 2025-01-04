import {Stack, useRouter} from "expo-router";
import React, {useEffect} from "react";
import {useApiConfig} from "@/components/config/context";
import {WihTitle} from "@/components/WihText";

export default function ConfigLayout() {
    const router = useRouter();
    const {config, isLoading} = useApiConfig();

    useEffect(() => {
        if (config && config.apikey && config.baseUri) {
            router.replace("/");
        }
    }, [config]);

    if (isLoading) {
        return <WihTitle>Loading...</WihTitle>
    }

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
        </Stack>
    )
}