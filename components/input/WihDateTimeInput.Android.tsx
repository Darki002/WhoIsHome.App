import {Text, TextStyle} from "react-native";
import {DateTimePickerAndroid, DateTimePickerEvent} from "@react-native-community/datetimepicker";
import React from "react";

export interface WihDateInputProps {
    value?: Date;
    onChangeDate: (date: Date | undefined) => void;
    style?: TextStyle;
}

export const WihDateInput = ({value, onChangeDate, style}: WihDateInputProps) => {
    const onChange= (_ : DateTimePickerEvent, newDate : Date | undefined) => {
        onChangeDate(newDate)
    }

    const show = () => {
        DateTimePickerAndroid.open({
            value: value ?? new Date(Date.now()),
            onChange,
            mode: "date",
            is24Hour: true,
        });
    }

    // TODO: ios? Support? Browser? Probably to new file with platform extension

    return <Text onPress={show} style={style}>{value?.toDateString()}</Text>
}