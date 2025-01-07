import Ionicons from '@expo/vector-icons/Ionicons';
import {type IconProps} from '@expo/vector-icons/build/createIconSet';
import {type ComponentProps} from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {useThemeColor} from '@/hooks/useThemeColor';
import {OpaqueColorValue} from 'react-native';

export interface AwesomeIconProps extends IconProps<ComponentProps<typeof FontAwesome>["name"]> {
}

export const AwesomeIcon = ({style, color, ...rest}: AwesomeIconProps) => {
    const tintColor = useIconColor(color);
    return <FontAwesome style={[{color: tintColor}, style]} {...rest} />
}

export interface IoniconsProps extends IconProps<ComponentProps<typeof Ionicons>["name"]> {
}

export const IonIcon = ({style, color, ...rest}: IoniconsProps) => {
    const tintColor = useIconColor(color);
    return <Ionicons style={[{color: tintColor}, style]} {...rest} />;
}

export interface MaterialIconProps extends IconProps<ComponentProps<typeof MaterialIcons>["name"]> {
}

export const MaterialIcon = ({style, color, ...rest}: MaterialIconProps) => {
    const tintColor = useIconColor(color);
    return <MaterialIcons style={[{color: tintColor}, style]} {...rest} />
}

export interface MaterialCommunityIconProps extends IconProps<ComponentProps<typeof MaterialCommunityIcons>["name"]> {
}

export const MaterialCommunityIcon = ({style, color, ...rest}: MaterialCommunityIconProps) => {
    const tintColor = useIconColor(color);
    return <MaterialCommunityIcons style={[{color: tintColor}, style]} {...rest} />
}

function useIconColor(color: string | OpaqueColorValue | undefined): string | OpaqueColorValue {
    if (color) {
        return color;
    }

    return useThemeColor("icon");
}