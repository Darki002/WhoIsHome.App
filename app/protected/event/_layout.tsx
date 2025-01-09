import {Stack} from "expo-router";
import {useWihTheme} from "@/components/WihThemeProvider";

export default function EventLayout() {
    const theme = useWihTheme();

    return (
        <Stack>
            <Stack.Screen name="view/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background}
            }}/>
            <Stack.Screen name="view/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background}
            }}/>
            <Stack.Screen name="edit/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background}
            }}/>
            <Stack.Screen name="edit/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: theme.background}
            }}/>
        </Stack>
    )
}