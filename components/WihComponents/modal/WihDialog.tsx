import { Modal, StyleSheet, View } from "react-native";
import WihView from "@/components/WihComponents/view/WihView";
import { WihText } from "@/components/WihComponents/display/WihText";
import { WihButton } from "@/components/WihComponents/input/WihButton";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

interface WihDialogProps {
    visible: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function WihDialog({ visible, title, message, onConfirm, onCancel }: WihDialogProps) {
    const theme = useWihTheme();
    const {t} = useTranslation();

    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <WihView style={[styles.dialog, { backgroundColor: theme.background }]}>
                    {title && <WihText style={styles.title}>{title}</WihText>}
                    {message && <WihText style={styles.message}>{message}</WihText>}
                    <WihView flex="row">
                        <WihButton onPress={onCancel} style={styles.cancelButton}>
                            {t(Labels.actions.cancel)}
                        </WihButton>
                        <WihButton onPress={onConfirm} style={styles.confirmButton}>
                            {t(Labels.actions.confirm)}
                        </WihButton>
                    </WihView>
                </WihView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        width: "80%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: "gray",
    },
    confirmButton: {
        flex: 1,
    },
});
