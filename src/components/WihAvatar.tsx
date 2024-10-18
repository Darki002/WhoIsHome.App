import WihText from "./WihText";
import WihView from "./WihView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Platform, StyleSheet } from 'react-native';

export interface AvatarProps {
    name: string;
    size?: number;
    backgroundColor?: string;
    textColor?: string;
}

export const WihAvatar = ({ name, size, backgroundColor, textColor }: AvatarProps) => {

    const avatarSize = size ?? 40;
    const background = useThemeColor("primary", { light: backgroundColor, dark: backgroundColor });
    const text = useThemeColor("text", { light: textColor, dark: textColor });

    const letter = name[0].toUpperCase();

    return (
        <WihView style={[{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: background,
        }, styles.avatar]}>
            <WihText style={[styles.letter, { fontSize: avatarSize / 2, color: text, fontFamily: "Roboto" }]}>{letter}</WihText>
        </WihView>
    )
}

const styles = StyleSheet.create({
    avatar: {
        justifyContent: "center",
        alignItems: "center"
    },
    letter: {
        fontWeight: 'bold',
    }
});