import {WihText} from "./WihText";
import WihView from "./WihView";
import {StyleSheet, ViewStyle} from 'react-native';
import {useWihTheme} from "@/components/WihThemeProvider";

export interface AvatarProps {
    name: string;
    size?: number;
    style?: ViewStyle;
}

export const WihAvatar = ({name, size, style}: AvatarProps) => {
    const theme = useWihTheme();

    const avatarSize = size ?? 40;
    const letter = name.length > 0 ? name[0].toUpperCase() : "";

    return (
        <WihView style={[{
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: theme.primary,
        }, styles.avatar, style]}>
            <WihText style={[styles.letter, {
                fontSize: avatarSize / 2,
                color: theme.text,
                fontFamily: "Roboto"
            }]}>{letter}</WihText>
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