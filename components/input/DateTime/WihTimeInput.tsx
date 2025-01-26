import React, {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {StyleSheet, TouchableOpacity} from "react-native";
import {WihText} from "@/components/WihText";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

export interface WihTimeInputProps {
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihTimeInput = ({value, onChange, disabled = false}: WihTimeInputProps) => {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
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