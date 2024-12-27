import {Stack} from "expo-router";

export default function EventLayout() {
    return (
        <Stack>
            <Stack.Screen name="event" options={{presentation: "modal", title: "Unknown"}} />
        </Stack>
    )
}