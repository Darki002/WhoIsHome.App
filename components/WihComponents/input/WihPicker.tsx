import {Picker} from "@react-native-picker/picker";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import WihView from "@/components/WihComponents/view/WihView";
import React, {useState} from "react";
import {WihText} from "@/components/WihComponents/display/WihText";

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
    onValidationChange?: (name: string, hasError: boolean) => void;
}

export function WihPicker<T>({
                                 value,
                                 name,
                                 options,
                                 onChange,
                                 validate,
                                 validationErrorMessage,
                                 onValidationChange,
                             }: WihPickerProps<T>) {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [hasValidationError, setHasValidationError] = useState<boolean>(false);

    const onEndEditing = () => {
        const invalid = validate ? !validate(value) : false;
        setHasValidationError(invalid);
        onValidationChange?.(name, invalid);
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
                hasValidationError && validationErrorMessage
                && <WihText style={{color: theme.error}}>{t(validationErrorMessage)}</WihText>
            }
        </WihView>
    );
}
