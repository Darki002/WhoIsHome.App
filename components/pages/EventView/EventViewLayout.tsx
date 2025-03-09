import {useNavigation} from "expo-router";
import {PropsWithChildren, useEffect, useState} from "react";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {usePermission} from "@/hooks/usePermission";
import {EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import WihDialog from "@/components/WihComponents/modal/WihDialog";
import {WihResponse} from "@/helper/fetch/WihResponse";

interface EventViewLayoutProps {
    event: EventModelBase;
    onEdit: () => void;
    onDelete: () => void;
}

export default function EventViewLayout({event, onEdit, onDelete, children}: PropsWithChildren<EventViewLayoutProps>) {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const permissionCheck = usePermission();
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        navigation.setOptions({title: event.title ?? "Untitled Event"});
    }, [event]);

    const showOwnerActions = () => {
        const isOwner = permissionCheck(event.userId);
        if(isOwner) {
            return (
                <WihView flex="row" style={{gap: 30}}>
                    <WihButton onPress={() => setShowDeleteDialog(true)}>{t(Labels.actions.delete)}</WihButton>
                    <WihButton onPress={onEdit}>{t(Labels.actions.edit)}</WihButton>
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