import { WihText } from "@/components/WihText";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

export interface WihDateInputProps {
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihDateInput = ({ value, onChange, disabled = false }: WihDateInputProps) => {
    const theme = useWihTheme();

    const onDateChange = (_: DateTimePickerEvent, newDate: Date | undefined) => {
        onChange(newDate);
    };

    const showDatePicker = () => {
        if (disabled) return;
        DateTimePickerAndroid.open({
            value: value ?? new Date(),
            onChange: onDateChange,
            mode: "date",
            is24Hour: true
        });
    };

    const formattedDate = value ? value.toLocaleDateString() : "Select a date";
    console.log("android");

    return (
        <TouchableOpacity
            onPress={showDatePicker}
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
    );
};

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
