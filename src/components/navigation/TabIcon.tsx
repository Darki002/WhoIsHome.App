import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const AwesomeTabIcon = ({ name, color, style }: IconProps<ComponentProps<typeof FontAwesome>["name"]>) => {
    return <FontAwesome name={name} color={color} size={28} style={[{ marginBottom: -3 }, style]} />
}

export const IonTabIcon = ({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) => {
    return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}