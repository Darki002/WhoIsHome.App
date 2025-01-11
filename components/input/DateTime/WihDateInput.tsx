import React, {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Text} from "react-native";

export interface WihDateInputProps {
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihDateInput = ({value, onChange, disabled = false}: WihDateInputProps) => {
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
    };

    const showPicker = () => {
        setShow(true);
    };

    if (disabled) {
        const displayValue = value?.toLocaleDateString() ?? "dd-MM-yyyy";
        return <Text style={{color: "grey"}}>{displayValue}</Text>
    }

    if(value === null){
        return <Text>dd-MM-yyyy</Text>
    }

    const date = value ?? new Date(Date.now());

    return (
        <>
            <Text onPress={showPicker}>{date.toLocaleDateString()}</Text>
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