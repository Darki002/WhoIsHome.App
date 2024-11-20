import {Text, TextStyle} from "react-native";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {useState} from "react";

export interface WihDateInputProps {
    value?: Date;
    onChangeDate: (date: Date | undefined) => void;
    style?: TextStyle;
}

export const WihDateInput = (date: Date, onDateChange: (newDate?: Date) => void) => {
    const [show, setShow] = useState<boolean>(false);

    const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShow(false);
        onDateChange(currentDate);
    };

    const showPicker = () => {
        setShow(true);
    };

    return(
        <>
            <Text onPress={showPicker}>selected: {date.toLocaleString()}</Text>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
        </>
    )
}