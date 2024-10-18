import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export interface AwesomeIconProps extends IconProps<ComponentProps<typeof FontAwesome>["name"]> { }

export const AwesomeIcon = ({ style, ...rest }: AwesomeIconProps) => {
    return <FontAwesome style={style} {...rest} />
}

export interface IoniconsProps extends IconProps<ComponentProps<typeof Ionicons>["name"]> { }

export const IonIcon = ({ style, ...rest }: IoniconsProps) => {
    return <Ionicons style={style} {...rest} />;
}

export interface MateriaIconProps extends IconProps<ComponentProps<typeof MaterialIcons>["name"]> { }

export const MateriaIcon = ({ style, ...rest }: MateriaIconProps) => {
    return <MaterialIcons style={style} {...rest} />
}

export interface MaterialCommunityIconProps extends IconProps<ComponentProps<typeof MaterialCommunityIcons>["name"]> { }

export const MaterialCommunityIcon = ({ style, ...rest }: MaterialCommunityIconProps) => {
    return <MaterialCommunityIcons style={style} {...rest} />
}