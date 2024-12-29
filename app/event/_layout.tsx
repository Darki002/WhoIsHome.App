import {Stack} from "expo-router";
import {useThemeColor} from "@/hooks/useThemeColor";

export default function EventLayout() {
    const backgroundColor = useThemeColor("background");

    return (
        <Stack>
            <Stack.Screen name="event/view/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: { backgroundColor: backgroundColor }
            }}/>
            <Stack.Screen name="event/view/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: { backgroundColor: backgroundColor }
            }}/>
            <Stack.Screen name="event/edit/oneTime/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: { backgroundColor: backgroundColor }
            }}/>
            <Stack.Screen name="event/edit/repeated/[id]" options={{
                presentation: "modal",
                title: "Unknown",
                headerStyle: { backgroundColor: backgroundColor }
            }}/>
        </Stack>
    )
}