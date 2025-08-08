import React, {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {StyleSheet, TouchableOpacity} from "react-native";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

export interface WihDateInputProps {
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihDateInput = ({value, onChange, disabled = false}: WihDateInputProps) => {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
    };

    const formattedDate = value ? value.toLocaleDateString() : t(Labels.placeholders.selectDate);
    const date = value ? value : new Date();

    return (
        <>
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