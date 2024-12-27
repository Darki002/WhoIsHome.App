import {Stack} from "expo-router";

export default function EventLayout() {
    return (
        <Stack>
            <Stack.Screen name="event/view/oneTime" options={{presentation: "modal", title: "Unknown"}}/>
            <Stack.Screen name="event/view/repeated" options={{presentation: "modal", title: "Unknown"}}/>
        </Stack>
    )
}