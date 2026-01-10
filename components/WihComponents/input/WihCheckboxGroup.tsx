import {StyleSheet, TouchableOpacity} from "react-native";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useTranslation} from "react-i18next";
import React, {useState} from "react";

export type WihOption<T> = {
    value?: T;
    displayTextLabel: string;
}

export interface WihCheckboxGroupProps<T> {
    values?: T[];
    name: string;
    options: Array<WihOption<T>>;
    direction?: "row" | "column";
    onChange: (values: T[]) => void;
    validate?: (value: T[]) => boolean;
    validationErrorMessage?: string;
    onValidationChange?: (name: string, hasError: boolean) => void;
}

export function WihCheckboxGroup<T>({
                                        values = [],
                                        name,
                                        options,
                                        direction = "column",
                                        onChange,
                                        validate,
                                        validationErrorMessage,
                                        onValidationChange,
                                    }: WihCheckboxGroupProps<T>) {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [hasValidationError, setHasValidationError] = useState<boolean>(false);

    const handlePress = (optionValue: T | undefined) => {
        if (optionValue === undefined) return;

        const isSelected = values.some(v => v === optionValue);
        const newValues = isSelected
            ? values.filter(v => v !== optionValue)
            : [...values, optionValue];

        const invalid = validate ? !validate(newValues) : false;
        setHasValidationError(invalid);
        onValidationChange?.(name, invalid);

        onChange(newValues);
    };

    const isSelected = (optionValue: T | undefined) => {
        if (optionValue === undefined) return false;
        return values.some(v => v === optionValue);
    };

    return (
        <WihView>
            <WihView style={[styles.container, {flexDirection: direction}]}>
                {options.map((option, index) => {
                    const selected = isSelected(option.value);
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handlePress(option.value)}
                            style={[
                                styles.option,
                                {
                                    borderColor: selected ? theme.primary : theme.border,
                                    backgroundColor: 'transparent',
                                },
                            ]}
                        >
                            <WihView style={styles.checkboxContainer}>
                                <WihText
                                    style={{
                                        color: selected ? theme.primary : theme.text
                                    }}
                                >
                                    {t(option.displayTextLabel)}
                                </WihText>
                            </WihView>
                        </TouchableOpacity>
                    );
                })}
            </WihView>
            {
                hasValidationError && validationErrorMessage
                && <WihText style={{color: theme.error, paddingTop: 10}}>{t(validationErrorMessage)}</WihText>
            }
        </WihView>
    );
}

const CIRCLE_SIZE = 36;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        flexWrap: "wrap",
    },
    option: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
    },
    checkboxContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
});