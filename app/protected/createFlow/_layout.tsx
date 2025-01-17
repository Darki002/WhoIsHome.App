import {Stack} from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="oneTimeEventFlow" options={{headerShown: false}}/>
            <Stack.Screen name="repeatedEventFlow" options={{headerShown: false}}/>
        </Stack>
    );
}