import {Picker} from "@react-native-picker/picker";

export type WihOption<T> = {
    value?: T;
    displayTextLabel: string;
}

export interface WihPickerProps<T> {
    value?: T;
    options: Array<WihOption<T>>;
    onChange: (value: T | undefined) => void;
}

export function WihPicker<T>({
                                       value,
                                       options,
                                       onChange,
                                   }: WihPickerProps<T>) {
    return (
        <Picker
        selectedValue={value}
        onValueChange={onChange}>
            {options.map((option, index) => (
                <Picker.Item key={index} label={option.displayTextLabel} value={option.value} />
            ))}
        </Picker>
    );
}