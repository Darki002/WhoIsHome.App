import {Text, TextStyle} from "react-native";
import {DateTimePickerAndroid, DateTimePickerEvent} from "@react-native-community/datetimepicker";
import React from "react";

export interface WihDateTimeInputProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    style?: TextStyle;
}

export const WihDateInput = ({value, onChange, style}: WihDateTimeInputProps) => {
    const onDateChange= (_ : DateTimePickerEvent, newDate : Date | undefined) => {
        onChange(newDate)
    }

    const date = value ?? new Date(Date.now());

    const show = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onDateChange,
            mode: "date",
            is24Hour: true,
        });
    }

    return <Text onPress={show} style={style}>{date.toLocaleDateString()}</Text>
}

export const WihTimeInput = ({value, onChange, style}: WihDateTimeInputProps) => {
    const onDateChange= (_ : DateTimePickerEvent, newDate : Date | undefined) => {
        onChange(newDate)
    }

    const time = value ?? new Date(Date.now());

    const show = () => {
        DateTimePickerAndroid.open({
            value: time,
            onChange: onDateChange,
            mode: "time",
            is24Hour: true,
        });
    }

    return <Text onPress={show} style={style}>{time.toLocaleTimeString()}</Text>
}