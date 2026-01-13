import {Picker} from "@react-native-picker/picker";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import WihView from "@/components/WihComponents/view/WihView";
import React, {useEffect} from "react";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useWihValidationField, Validator} from "@/hooks/useWihValidation";

export type WihOption<T> = {
    value?: T;
    displayTextLabel: string;
}

export interface WihPickerProps<T> {
    value?: T;
    name: string;
    options: Array<WihOption<T>>;
    onChange: (value: T | undefined) => void;
    validate?: (value?: T) => boolean;
    validationErrorMessage?: string;
    validator?: Validator;
}

export function WihPicker<T>({
                                 value,
                                 name,
                                 options,
                                 onChange,
                                 validate,
                                 validationErrorMessage,
                                 validator,
                             }: WihPickerProps<T>) {
    const theme = useWihTheme();
    const {t} = useTranslation();

    useWihValidationField({ validator, name, value, validate });

    useEffect(() => {
        if (!validator || !name) return;
        const isValid = validate ? validate(value) : true;
        validator.setFieldValidity(name, isValid, undefined);
    }, [value, validator, name, validate]);

    const onEndEditing = () => {
        const invalid = validate ? !validate(value) : false;
        validator?.handleValidationChange(name, invalid);
        onChange(value);
    }

    return (
        <WihView>
            <Picker
                selectedValue={value}
                onValueChange={onEndEditing}
                mode="dropdown"
                dropdownIconColor={theme.text}
                style={{
                    color: theme.text,
                    backgroundColor: theme.background,
                    width: 200
                }}
            >
                {options.map((option, index) => (
                    <Picker.Item key={index} label={t(option.displayTextLabel)} value={option.value} />
                ))}
            </Picker>
            {
                validator?.hasValidationError(name) && validationErrorMessage
                && <WihText style={{color: theme.error}}>{t(validationErrorMessage)}</WihText>
            }
        </WihView>
    );
}
