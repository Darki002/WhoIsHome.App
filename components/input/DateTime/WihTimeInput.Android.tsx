import { WihText } from "@/components/WihText";
import { TouchableOpacity, StyleSheet } from "react-native";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {useWihTheme} from "@/components/WihThemeProvider";

export interface WihTimeInputProps {
    value?: Date | null;
    onChange: (date: Date | undefined) => void;
    disabled?: boolean;
}

export const WihTimeInput = ({ value, onChange, disabled = false }: WihTimeInputProps) => {
    const theme = useWihTheme();

    const onTimeChange = (_: DateTimePickerEvent, newTime: Date | undefined) => {
        onChange(newTime);
    };

    const showTimePicker = () => {
        if (disabled) return;
        DateTimePickerAndroid.open({
            value: value ?? new Date(),
            onChange: onTimeChange,
            mode: "time",
            is24Hour: true,
        });
    };

    const formattedTime = value
        ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Select a time";

    return (
        <TouchableOpacity
            onPress={showTimePicker}
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
