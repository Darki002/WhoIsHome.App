import {Pressable, StyleSheet} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {WihText} from "@/components/WihText";
import {ReactNode} from "react";

type WihButtonProps = {
    children: ReactNode;
    onPress: () => void;
    style?: object;
};

export const WihButton = ({ children, onPress, style }: WihButtonProps) => {
    const color = useThemeColor("primary");
    return (
        <Pressable onPress={onPress} style={[{backgroundColor: color}, styles.button, style]}>
            <WihText>{children}</WihText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 7
    }
});