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

        const invalid = validate ? !validate(values) : false;
        setHasValidationError(invalid);
        onValidationChange?.(name, invalid);

        const isSelected = values.some(v => v === optionValue);

        if (isSelected) {
            onChange(values.filter(v => v !== optionValue));
        } else {
            onChange([...values, optionValue]);
        }
    };

    const isSelected = (optionValue: T | undefined) => {
        if (optionValue === undefined) return false;
        return values.some(v => v === optionValue);
    };

    return (
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
                                backgroundColor: selected ? theme.primary : 'transparent',
                                borderWidth: 2,
                            },
                        ]}
                    >
                        <WihView style={styles.checkboxContainer}>
                            <WihView
                                style={[
                                    styles.checkbox,
                                    {
                                        borderColor: selected ? theme.textInverse : theme.border,
                                        backgroundColor: selected ? theme.textInverse : 'transparent',
                                    },
                                ]}
                            >
                                {selected && (
                                    <WihText
                                        style={[
                                            styles.checkmark,
                                            {color: theme.primary}
                                        ]}
                                    >
                                        ✓
                                    </WihText>
                                )}
                            </WihView>
                            <WihText
                                style={{
                                    color: selected ? theme.textInverse : theme.text,
                                    flex: 1,
                                }}
                            >
                                {t(option.displayTextLabel)}
                            </WihText>
                        </WihView>
                    </TouchableOpacity>
                );
            })}
            {
                hasValidationError && validationErrorMessage
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
        alignItems: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: "100%",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 3,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    checkmark: {
        fontSize: 14,
        fontWeight: "bold",
    },
});