import {ActivityIndicator} from "react-native";
import {useWihTheme} from "@/components/WihThemeProvider";

export default function WihLoading() {
    const theme = useWihTheme();
    return (
        <ActivityIndicator size="large" color={theme.primary} />
    )
}