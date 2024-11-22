import {Text, TextStyle} from "react-native";
import {DateTimePickerAndroid, DateTimePickerEvent} from "@react-native-community/datetimepicker";
import React from "react";
import * as diagnostics_channel from "node:diagnostics_channel";

export interface WihDateTimeInputProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihDateInput = ({value, onChange, disabled = false}: WihDateTimeInputProps) => {
    const onDateChange= (_ : DateTimePickerEvent, newDate : Date | undefined) => {
        onChange(newDate)
    }

    if(disabled){
        return <Text style={{color: "grey"}}>dd-MM-yyyy</Text>
    }

    const date = value ?? new Date(Date.now());

    const show = () => {
        if(disabled) return;

        DateTimePickerAndroid.open({
            value: date,
            onChange: onDateChange,
            mode: "date",
            is24Hour: true,
        });
    }

    return <Text onPress={show}>{date.toLocaleDateString()}</Text>
}

export const WihTimeInput = ({value, onChange, disabled = false}: WihDateTimeInputProps) => {
    const onDateChange= (_ : DateTimePickerEvent, newDate : Date | undefined) => {
        onChange(newDate)
    }

    if(disabled){
        return <Text style={{color: "grey"}}>HH-mm</Text>
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

    return <Text onPress={show}>{time.toLocaleTimeString()}</Text>
}