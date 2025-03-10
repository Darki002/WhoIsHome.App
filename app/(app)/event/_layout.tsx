import {Stack} from "expo-router";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {Colors} from "@/constants/Colors";

export default function EventLayout() {
    const theme = useWihTheme();

    const screenOptions = {
        contentStyle: {
            backgroundColor: theme.background
        }
    };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="view/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background},
                headerTintColor: theme.text
            }}/>
            <Stack.Screen name="view/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background},
                headerTintColor: theme.text
            }}/>
            <Stack.Screen name="edit/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background},
                headerTintColor: theme.text
            }}/>
            <Stack.Screen name="edit/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background},
                headerTintColor: theme.text
            }}/>
        </Stack>
    )
}