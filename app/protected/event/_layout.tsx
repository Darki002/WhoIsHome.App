import {Stack} from "expo-router";
import {useThemeColor} from "@/hooks/useThemeColor";

export default function EventLayout() {
    const backgroundColor = useThemeColor("background");

    return (
        <Stack>
            <Stack.Screen name="view/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: backgroundColor}
            }}/>
            <Stack.Screen name="view/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: backgroundColor}
            }}/>
            <Stack.Screen name="edit/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: backgroundColor}
            }}/>
            <Stack.Screen name="edit/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: {backgroundColor: backgroundColor}
            }}/>
        </Stack>
    )
}