import {TextInputProps, TextStyle, ViewStyle} from "react-native";
import React from "react";
import Labels from "@/constants/locales/Labels";
import {WihTextInput} from "@/components/input/WihTextInput";
import {useTranslation} from "react-i18next";

export interface WihUsernameInputProps {
    value?: string;
    onChangeValue: (userName: string) => void;
    style?: (ViewStyle | ViewStyle[]) & TextStyle;
    autoComplete: "new" | "current";
}

export const WihUsernameInput = ({value, onChangeValue, autoComplete, style} : WihUsernameInputProps) => {
    const {t} = useTranslation();

    let autoCompleteType: TextInputProps["autoComplete"];
    switch (autoComplete) {
        case "new":
            autoCompleteType = "username-new";
            break;
        case "current":
            autoCompleteType = "username";
            break;
        default:
            autoCompleteType = "username";
            break;
    }

    return <WihTextInput
        value={value}
        onChangeText={onChangeValue}
        placeholder={t(Labels.placeholders.userName)}
        style={style}
        autoComplete={autoCompleteType}
        inputMode="text"
        autoFocus />
}

export interface WihEmailInputProps {
    value?: string;
    onChangeValue: (email: string) => void;
    style?: (ViewStyle | ViewStyle[]) & TextStyle;
}

export const WihEmailInput = ({value, onChangeValue, style} : WihEmailInputProps) => {
    const {t} = useTranslation();

    return <WihTextInput
        value={value}
        onChangeText={onChangeValue}
        placeholder={t(Labels.placeholders.email)}
        style={style}
        autoComplete="email"
        inputMode="email" />
}

export interface WihPasswordInputProps {
    value?: string;
    onChangeValue: (password: string) => void;
    style?: (ViewStyle | ViewStyle[]) & TextStyle;
    autoComplete: "new" | "current";
}

export const WihPasswordInput = ({autoComplete, value, onChangeValue, style, ...rest}: WihPasswordInputProps) => {
    const {t} = useTranslation();

    let autoCompleteType: TextInputProps["autoComplete"];
    switch (autoComplete) {
        case "new":
            autoCompleteType = "new-password";
            break;
        case "current":
            autoCompleteType = "current-password";
            break;
        default:
            autoCompleteType = "current-password";
            break;
    }

    return <WihTextInput
        value={value}
        onChangeText={onChangeValue}
        placeholder={t(Labels.placeholders.password)}
        secureTextEntry
        autoComplete={autoCompleteType}
        inputMode="text"
        {...rest} />
}