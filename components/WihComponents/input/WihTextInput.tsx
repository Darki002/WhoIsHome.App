import React, {FC, useState} from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {useTranslation} from "react-i18next";

type WihTextInputProps = TextInputProps & {
    style?: ViewStyle | ViewStyle[];
    name: string;
    validate?: (text?: string) => boolean;
    validationErrorMessage?: string;
    onValidationChange?: (name: string, hasError: boolean) => void;
};

export const WihTextInput: FC<WihTextInputProps> = ({
                                                        value,
                                                        placeholder,
                                                        onChangeText,
                                                        name,
                                                        validate,
                                                        validationErrorMessage,
                                                        onValidationChange,
                                                        style,
                                                        ...rest
}) => {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValidationError, setHasValidationError] = useState<boolean>(false);

    const onEndEditing = () => {
        const invalid = validate ? !validate(value) : false;
        setHasValidationError(invalid);
        onValidationChange?.(name, invalid);
    }

    return (
        <WihView>
            <TextInput
                inputMode="text"
                value={value}
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                onChangeText={onChangeText}
                onEndEditing={onEndEditing}
                style={[
                    styles.input,
                    {
                        color: theme.text,
                        borderColor: isFocused ? theme.primary : theme.border,
                    },
                    style,
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...rest}
            />
            {
                hasValidationError && validationErrorMessage
                    && <WihText style={{color: theme.error}}>{t(validationErrorMessage)}</WihText>
            }
        </WihView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
    },
});
