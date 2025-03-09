import {ActivityIndicator} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import WihView from "@/components/WihComponents/view/WihView";
import React from "react";

export const WihLoading = () => {
    const theme = useWihTheme();
    return (
        <ActivityIndicator size="large" color={theme.primary} />
    )
};

export const WihLoadingView = () => (
    <WihView center="full">
        <WihLoading/>
    </WihView>
);