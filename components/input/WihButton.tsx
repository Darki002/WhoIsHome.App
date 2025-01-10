import {Pressable, StyleSheet, Text, ViewStyle} from "react-native";
import {ReactNode} from "react";
import {useWihTheme} from "@/components/WihThemeProvider";

type WihButtonProps = {
    children: ReactNode;
    onPress: () => void;
    style?: object;
};

export const WihButton = ({children, onPress, style}: WihButtonProps) => {
    const theme = useWihTheme();

    const buttonStyle: ViewStyle = {
        backgroundColor: theme.background
    }

    return (
        <Pressable onPress={onPress} style={[buttonStyle, styles.button, style]}>
            <Text>{children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 7
    }
});