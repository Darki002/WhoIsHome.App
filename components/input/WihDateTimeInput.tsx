import {Text} from "react-native";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {useState} from "react";

export interface WihDateInputProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
}

export const WihDateInput = ({value, onChange}: WihDateInputProps) => {
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
    };

    const showPicker = () => {
        setShow(true);
    };

    const date = value ?? new Date(Date.now());

    return(
        <>
            <Text onPress={showPicker}>selected: {date.toLocaleDateString()}</Text>
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

export const WihTimeInput = ({value, onChange}: WihDateInputProps) => {
    const [show, setShow] = useState<boolean>(false);

    const onDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onChange(currentDate);
    };

    const showPicker = () => {
        setShow(true);
    };

    const time = value ?? new Date(Date.now());

    return(
        <>
            <Text onPress={showPicker}>selected: {time.toLocaleTimeString()}</Text>
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