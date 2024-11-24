import {Text} from "react-native";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import React, {useState} from "react";

export interface WihDateTimeInputProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihDateInput = ({value, onChange, disabled = false}: WihDateTimeInputProps) => {
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
    };

    const showPicker = () => {
        setShow(true);
    };

    if(disabled){
        return <Text style={{color: "grey"}}>dd-MM-yyyy</Text>
    }

    const date = value ?? new Date(Date.now());

    return(
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

export const WihTimeInput = ({value, onChange, disabled = false}: WihDateTimeInputProps) => {
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
    };

    const showPicker = () => {
        setShow(true);
    };

    if(disabled){
        return <Text style={{color: "grey"}}>HH-mm</Text>
    }

    const time = value ?? new Date(Date.now());

    return(
        <>
            <Text onPress={showPicker}>{time.toLocaleTimeString()}</Text>
            {show && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    onChange={onDateChange}
                />
            )}
        </>
    )
}