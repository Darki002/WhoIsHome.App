import {Stack} from "expo-router";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

export default function Layout() {
    const theme = useWihTheme();
    const {t} = useTranslation();

    const screenOptions = {
        contentStyle: {
            backgroundColor: theme.background
        }
    };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="oneTimeEventFlow" options={{
                headerStyle: {backgroundColor: theme.background},
                headerTintColor: theme.text,
                headerTitle: t(Labels.oneTimeEvent)
            }}/>

            <Stack.Screen name="repeatedEventFlow" options={{
                headerStyle: {backgroundColor: theme.background},
                headerTintColor: theme.text,
                headerTitle: t(Labels.repeatedEvent)
            }}/>
        </Stack>
    );
}