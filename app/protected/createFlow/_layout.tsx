import {Stack} from "expo-router";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

export default function Layout() {
    const theme = useWihTheme();
    const screenOptions = {
        contentStyle: {
            backgroundColor: theme.background
        }
    };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="oneTimeEventFlow" options={{headerShown: false}}/>
            <Stack.Screen name="repeatedEventFlow" options={{headerShown: false}}/>
        </Stack>
    );
}