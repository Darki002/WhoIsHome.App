import React, {useState} from "react";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Text} from "react-native";

export interface WihTimeInputProps {
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihTimeInput = ({value, onChange, disabled = false}: WihTimeInputProps) => {
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
        const displayValue = value?.toLocaleTimeString() ?? "HH-mm";
        return <Text style={{color: "grey"}}>{displayValue}</Text>
    }

    let time = value;
    if(!value){
        const now = new Date();
        now.setHours(18, 0, 0);
        time = now;
    }

    return (
        <>
            <Text onPress={showPicker}>{time!.toLocaleTimeString()}</Text>
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