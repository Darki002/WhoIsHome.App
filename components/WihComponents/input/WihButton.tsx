import {Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle} from "react-native";
import {FC, ReactNode} from "react";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

type WihButtonProps = {
    children: ReactNode;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
};

export const WihButton: FC<WihButtonProps> = ({
                                                        children,
                                                        onPress,
                                                        disabled = false,
                                                        style,
                                                        textStyle
                                                    }) => {
    const theme = useWihTheme();

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: disabled ? theme.disabled : theme.primary },
                pressed && !disabled && { backgroundColor: theme.primary },
                style
            ]}
        >
            <Text style={[styles.text, { color: theme.buttonText }, textStyle]}>
                {children}
            </Text>
        </Pressable>
    );
};

export const WihTextButton: FC<WihButtonProps> = ({
                                                  children,
                                                  onPress,
                                                  disabled = false,
                                                  textStyle,
                                                  style
                                              }) => {
    const theme = useWihTheme();

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={style}
        >
            <Text style={[styles.text, { color: disabled ? theme.disabled : theme.primary }, textStyle]}>
                {children}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});