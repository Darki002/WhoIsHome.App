import React, {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {StyleSheet, TouchableOpacity} from "react-native";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import WihView from "@/components/WihComponents/view/WihView";
import {Validator} from "@/hooks/useWihValidation";

export interface WihTimeInputProps {
    value?: Date | null;
    name: string;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
    validate?: (value?: Date | null) => boolean;
    validationErrorMessage?: string;
    validator?: Validator;
}

export const WihTimeInput = ({value, name, onChange, validate, validationErrorMessage, validator, disabled = false}: WihTimeInputProps) => {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [show, setShow] = useState<boolean>(false);
    validator?.registerField(name, validate ? () => !validate(value) : () => false);

    const onEndEditing = () => {
        const invalid = validate ? !validate(value) : false;
        validator?.handleValidationChange(name, invalid);
    }

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
        onEndEditing();
    };

    const formattedTime = value
        ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : t(Labels.placeholders.selectTime);

    let time = value;
    if(!value){
        time = new Date();
        time.setHours(18, 0, 0);
    }

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
                        {formattedTime}
                    </WihText>
                </TouchableOpacity>
                {
                    validator?.hasValidationError(name) && validationErrorMessage
                    && <WihText style={{color: theme.error}}>{t(validationErrorMessage)}</WihText>
                }
            </WihView>

            {show && (
                <DateTimePicker
                    value={time!}
                    mode="time"
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