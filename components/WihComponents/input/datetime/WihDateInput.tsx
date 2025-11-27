import React, {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {StyleSheet, TouchableOpacity} from "react-native";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import WihView from "@/components/WihComponents/view/WihView";

export interface WihDateInputProps {
    value?: Date | null;
    name: string;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
    validate?: (value?: Date | null) => boolean;
    validationErrorMessage?: string;
    onValidationChange?: (name: string, hasError: boolean) => void;
}

export const WihDateInput = ({value, name, onChange, validate, validationErrorMessage, onValidationChange, disabled = false}: WihDateInputProps) => {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [show, setShow] = useState<boolean>(false);
    const [hasValidationError, setHasValidationError] = useState<boolean>(false);

    const onEndEditing = () => {
        const invalid = validate ? !validate(value) : false;
        setHasValidationError(invalid);
        onValidationChange?.(name, invalid);
    }

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
        onEndEditing();
    };

    const formattedDate = value ? value.toLocaleDateString() : t(Labels.placeholders.selectDate);
    const date = value ? value : new Date();

    return (
        <>
            <WihView>
                <TouchableOpacity
                    onPress={() => setShow(true)}
                    disabled={disabled}
                    style={[
                        styles.container,
                        {
                            backgroundColor: disabled ? theme.backgroundDisabled : theme.background,
                            borderColor: theme.primary,
                        },
                    ]}
                >
                    <WihText
                        style={{
                            color: disabled ? theme.textDisabled : theme.text,
                            fontWeight: "500",
                        }}
                    >
                        {formattedDate}
                    </WihText>
                </TouchableOpacity>
                {
                    hasValidationError && validationErrorMessage
                    && <WihText style={{color: theme.error}}>{t(validationErrorMessage)}</WihText>
                }
            </WihView>

            {show && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onDateChange}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
    },
});