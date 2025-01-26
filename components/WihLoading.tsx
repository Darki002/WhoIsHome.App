import {ActivityIndicator} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

export default function WihLoading() {
    const theme = useWihTheme();
    return (
        <ActivityIndicator size="large" color={theme.primary} />
    )
}