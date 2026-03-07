import {PropsWithChildren, useCallback, useEffect} from "react";
import {useNavigation} from "expo-router";
import {usePermission} from "@/hooks/usePermission";
import WihView from "@/components/WihComponents/view/WihView";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {ScrollView, StyleSheet} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

interface EventEditLayoutProps {
    title: string;
    userId: number;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EventEditLayout({title, userId, onCancel, onUpdate, children}: PropsWithChildren<EventEditLayoutProps>) {
    const {t} = useTranslation();
    const theme = useWihTheme();
    const navigation = useNavigation();
    const permissionCheck = usePermission();

    const onUpdatedChecked = useCallback(() => {
        const allowed = permissionCheck(userId);
        if(allowed){
            onUpdate();
        }
    }, [onUpdate, userId]);

    useEffect(() => {
        const effectiveTitle = title ?? t(Labels.errors.header);
        navigation.setOptions({title: `${t(Labels.headers.editing)}: ${effectiveTitle}`});
    }, [title]);

    return (
        <WihView style={{flex: 1}}>
            <ScrollView style={{height: "100%"}}>
                <WihView style={styles.container}>
                    {children}

                    <WihView flex="row" center="vertical" style={{gap: 30}}>
                        <WihButton style={{backgroundColor: theme.buttonBackgroundSecondary}} onPress={onCancel}>{t(Labels.actions.cancel)}</WihButton>
                        <WihButton onPress={onUpdatedChecked}>{t(Labels.actions.save)}</WihButton>
                    </WihView>
                </WihView>
            </ScrollView>
        </WihView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40
    }
})