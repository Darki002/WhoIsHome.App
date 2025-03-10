import {EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {PropsWithChildren, useCallback, useEffect} from "react";
import {useNavigation} from "expo-router";
import {usePermission} from "@/hooks/usePermission";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import {WihResponse} from "@/helper/fetch/WihResponse";

interface EventEditLayoutProps {
    response: WihResponse<EventModelBase | null> | null;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EventEditLayout({response, onCancel, onUpdate, children}: PropsWithChildren<EventEditLayoutProps>) {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const permissionCheck = usePermission();

    const onUpdatedChecked = useCallback(() => {
        const allowed = permissionCheck(response?.data?.userId);
        if(allowed){
            onUpdate();
        }
    }, [onUpdate, response]);

    useEffect(() => {
        if (!response) {
            navigation.setOptions({title: t(Labels.headers.unknown)});
            return;
        }
        if (!response.isValid()) {
            navigation.setOptions({title: t(Labels.errors.header)});
            return;
        }
        const title = response.data?.title ?? t(Labels.errors.header);
        navigation.setOptions({title: `${t(Labels.headers.editing)}: ${title}`});
    }, [response]);

    if (!response) {
        return null;
    }

    if (!response.isValid()) {
        return (
            <WihView center="full">
                <WihText>{t(Labels.errors.generic)}</WihText>
            </WihView>
        )
    }

    return (
        <WihView style={styles.container}>
            {children}

            {
                <WihView style={styles.buttons}>
                    <WihButton onPress={onCancel}>{t(Labels.actions.cancel)}</WihButton>
                    <WihButton onPress={onUpdatedChecked}>{t(Labels.actions.save)}</WihButton>
                </WihView>
            }
        </WihView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        gap: 30
    }
})