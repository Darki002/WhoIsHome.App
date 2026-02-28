import {Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle} from "react-native";
import {FC, ReactNode} from "react";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {MaterialIconProps, WihMaterialIcon} from "@/components/WihComponents/icon/WihIcon";
import {MaterialIcons} from "@expo/vector-icons";

interface WihButtonProps {
    children: ReactNode;
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: TextStyle;
}

interface WihIconButtonProps extends MaterialIconProps {
    onPress: () => void;
    disabled?: boolean;
    buttonStyle?: StyleProp<ViewStyle>;
}

export const WihButton: FC<WihButtonProps> = ({children, onPress, disabled = false, style, textStyle}) => {
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

export const WihTextButton: FC<WihButtonProps> = ({children, onPress, disabled = false, textStyle, style}) => {
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

export const WihIconButton: FC<WihIconButtonProps> = ({name, onPress, disabled = false, style, buttonStyle, ...rest}) => {
    const theme = useWihTheme();
    const color = disabled ? theme.disabled : theme.primary;

    return (
      <Pressable onPress={onPress} disabled={disabled} style={buttonStyle}>
          <WihMaterialIcon name={name} style={[{color}, style]} {...rest} />
      </Pressable>
    );
}

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