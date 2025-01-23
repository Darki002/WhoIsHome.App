import React, {ComponentProps, PropsWithChildren} from "react";
import {MaterialIcons} from "@expo/vector-icons";
import WihView from "@/components/WihView";
import {WihMaterialIcon} from "@/components/WihIcon";
import {StyleSheet} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

interface WihIconRowProps {
    name: ComponentProps<typeof MaterialIcons>["name"],
    flexDirection: "row" | "column";
}

const WihIconRow = ({children, name, flexDirection}: PropsWithChildren<WihIconRowProps>) => {
    const theme = useWihTheme();

    return (
        <WihView style={styles.container}>
            <WihMaterialIcon name={name} size={22} color={theme.primary} />
            <WihView style={[styles.dataContainer, {flexDirection: flexDirection}]}>
                {children}
            </WihView>
        </WihView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 20
    },
    dataContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
});

export default WihIconRow;