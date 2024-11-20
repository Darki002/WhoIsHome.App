import { useThemeColor } from "@/hooks/useThemeColor";
import {Text, TextInput, TextInputProps, TextStyle} from "react-native";
import React from "react";
import {DateTimePickerAndroid, DateTimePickerEvent} from '@react-native-community/datetimepicker';

export const WihTextInput = ({ value, onChangeText, style, ...rest }: TextInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");
    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} style={[{ color, borderColor }, style]} {...rest} />
}

export interface WihDateInputProps {
    value?: Date;
    onChangeDate: (date: Date | undefined) => void;
    style?: TextStyle;
}

export const WihDateInput = ({value, onChangeDate, style}: WihDateInputProps) => {
    const onChange= (_ : DateTimePickerEvent, newDate : Date | undefined) => {
        onChangeDate(newDate)
    }

    const show = () => {
        DateTimePickerAndroid.open({
            value: value ?? new Date(Date.now()),
            onChange,
            mode: "date",
            is24Hour: true,
        });
    }

    // TODO: ios? Support? Browser? Probably to new file with platform extension

    return <Text onPress={show} style={style}>{value?.toDateString()}</Text>
}

// TODO: same for the time

export const WihUsernameInput = ({ value, onChangeText, style, ...rest }: TextInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");
    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} autoComplete="username" placeholder="UserName" style={[{ color, borderColor }, style]} {...rest} />
}

export const WihEmailInput = ({ value, onChangeText, style, ...rest }: TextInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");
    return <TextInput inputMode="email" value={value} onChangeText={onChangeText} autoComplete="email" placeholder="Email" style={[{ color, borderColor }, style]} {...rest} />
}

export type WihPasswordInputProps = TextInputProps & {
    autoCompleteType: "new" | "current";
}

export const WihPasswordInput = ({ autoCompleteType, value, onChangeText, style, ...rest }: WihPasswordInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");

    let type: TextInputProps["autoComplete"];
    switch (autoCompleteType) {
        case "new":
            type = "new-password";
            break;
        case "current":
            type = "current-password";
            break;
        default:
            type = "current-password";
            break;
    }

    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} autoComplete={type} placeholder="Password" secureTextEntry style={[{ color, borderColor }, style]} {...rest} />
}