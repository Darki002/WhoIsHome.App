import {useNavigation} from "expo-router";
import {PropsWithChildren, useEffect, useState} from "react";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {WihButton} from "@/components/input/WihButton";
import {usePermission} from "@/hooks/usePermission";
import {EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import WihDialog from "@/components/WihDialog";
import {WihResponse} from "@/helper/fetch/WihResponse";

interface EventViewLayoutProps {
    response: WihResponse<EventModelBase | null> | null;
    onEdit: () => void;
    onDelete: () => void;
}

export default function EventViewLayout({response, onEdit, onDelete, children}: PropsWithChildren<EventViewLayoutProps>) {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const permissionCheck = usePermission();
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        if (!response) {
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if (!response.isValid()) {
            navigation.setOptions({title: "Error"});
            return;
        }
        navigation.setOptions({title: response.data?.title ?? "Untitled Event"});
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

    const showOwnerActions = () => {
        const isOwner = permissionCheck(response.data?.userId);
        if(isOwner) {
            return (
                <WihView flex="row">
                    <WihButton onPress={onEdit}>{t(Labels.actions.edit)}</WihButton>
                    <WihButton onPress={() => setShowDeleteDialog(true)}>{t(Labels.actions.delete)}</WihButton>
                </WihView>
            )
        }
        return null
    }

    return (
        <WihView style={styles.container}>
            {children}

            {showOwnerActions()}

            <WihDialog
                visible={showDeleteDialog}
                title={t(Labels.dialog.deleteTitle)}
                message={t(Labels.dialog.deleteMessage)}
                onConfirm={() => {
                    setShowDeleteDialog(false);
                    onDelete();
                }}
                onCancel={() => setShowDeleteDialog(false)}
            />

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
    }
})