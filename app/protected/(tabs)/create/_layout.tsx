import {Stack, useFocusEffect, useRouter} from "expo-router";

export default function Layout() {
    const router = useRouter();

    useFocusEffect(() => {
        router.replace("/protected/(tabs)/create");
    });

    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="oneTimeEventFlow" options={{headerShown: false}}/>
            <Stack.Screen name="repeatedEventFlow" options={{headerShown: false}}/>
        </Stack>
    );
}