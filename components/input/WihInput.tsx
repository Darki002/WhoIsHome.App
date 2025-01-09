import {TextInput, TextInputProps, TextStyle} from "react-native";
import React from "react";
import {useWihTheme} from "@/components/WihThemeProvider";

export const WihTextInput = ({value, placeholder, onChangeText, style, ...rest}: TextInputProps) => {
    const theme = useWihTheme();
    const inputStyle = {
        color: theme.text,
        borderColor: theme.border
    };

    return <TextInput inputMode="text" value={value} placeholder={placeholder} onChangeText={onChangeText}
                      style={[inputStyle, style]} {...rest} />
}

export interface WihDateInputProps {
    value?: Date;
    onChangeDate: (date: Date | undefined) => void;
    style?: TextStyle;
}

export const WihUsernameInput = ({value, onChangeText, style, ...rest}: TextInputProps) => {
    const theme = useWihTheme();
    const inputStyle = {
        color: theme.text,
        borderColor: theme.border
    };

    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} autoComplete="username"
                      placeholder="UserName" style={[inputStyle, style]} {...rest} />
}

export const WihEmailInput = ({value, onChangeText, style, ...rest}: TextInputProps) => {
    const theme = useWihTheme();
    const inputStyle = {
        color: theme.text,
        borderColor: theme.border
    };

    return <TextInput inputMode="email" value={value} onChangeText={onChangeText} autoComplete="email"
                      placeholder="Email" style={[inputStyle, style]} {...rest} />
}

export type WihPasswordInputProps = TextInputProps & {
    autoCompleteType: "new" | "current";
}

export const WihPasswordInput = ({autoCompleteType, value, onChangeText, style, ...rest}: WihPasswordInputProps) => {
    const theme = useWihTheme();
    const inputStyle = {
        color: theme.text,
        borderColor: theme.border
    };

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

    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} autoComplete={type}
                      placeholder="Password" secureTextEntry style={[inputStyle, style]} {...rest} />
}