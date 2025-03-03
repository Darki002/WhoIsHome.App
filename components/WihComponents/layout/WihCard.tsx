import { View, StyleSheet, ViewProps } from "react-native";
import {FC, ReactNode} from "react";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

interface WihBoxProps extends ViewProps {
    children: ReactNode;
}

export const WihCard: FC<WihBoxProps> = ({ children, style, ...otherProps }) => {
    const theme = useWihTheme();

    return (
        <View style={[styles.box, { backgroundColor: theme.cardBackground }, style]} {...otherProps}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        width: "90%",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default WihCard;
