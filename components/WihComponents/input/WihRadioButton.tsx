import {StyleSheet, TouchableOpacity} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {Validator} from "@/hooks/useWihValidation";

export type WihOption<T> = {
    value?: T;
    displayTextLabel: string;
}

export interface WihSingleChoiceProps<T> {
    value?: T;
    name: string;
    options: Array<WihOption<T>>;
    direction?: "row" | "column";
    onChange: (value: T | undefined) => void;
    allowDeselect?: boolean;
    validate?: (value?: T) => boolean;
    validationErrorMessage?: string;
    validator?: Validator;
}

export function WihRadioButton<T>({
                                       value,
                                       name,
                                       options,
                                       direction,
                                       onChange,
                                       validate,
                                       validationErrorMessage,
                                       validator,
                                       allowDeselect = true,
                                   }: WihSingleChoiceProps<T>) {
    const theme = useWihTheme();
    const {t} = useTranslation();
    validator?.registerField(name, validate ? () => !validate(value) : () => false);

    const handlePress = (optionValue: T | undefined) => {
        const invalid = validate ? !validate(value) : false;
        validator?.handleValidationChange(name, invalid);

        if (value === optionValue && allowDeselect) {
            onChange(undefined);
        } else {
            onChange(optionValue);
        }
    };

    return (
        <WihView style={[styles.container, {flexDirection: direction}]}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(option.value)}
                    style={[
                        styles.option,
                        value === option.value && {
                            backgroundColor: theme.primary,
                        },
                    ]}
                >
                    <WihText
                        style={{
                            color: value === option.value ? theme.textInverse : theme.text,
                        }}
                    >
                        {t(option.displayTextLabel)}
                    </WihText>
                </TouchableOpacity>
            ))}
            {
                validator?.hasValidationError(name) && validationErrorMessage
                && <WihText style={{color: theme.error}}>{t(validationErrorMessage)}</WihText>
            }
        </WihView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10
    },
    option: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
        alignItems: "center",
    },
});