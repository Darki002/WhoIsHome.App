import {Picker} from "@react-native-picker/picker";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import WihView from "@/components/WihComponents/view/WihView";

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
    const theme = useWihTheme();
    const {t} = useTranslation();

    return (
        <WihView>
            <Picker
                selectedValue={value}
                onValueChange={onChange}
                mode="dropdown"
                dropdownIconColor={theme.text}
                style={{
                    color: theme.text,
                    backgroundColor: theme.background,
                    width: 200
                }}
            >
                {options.map((option, index) => (
                    <Picker.Item key={index} label={t(option.displayTextLabel)} value={option.value} />
                ))}
            </Picker>
        </WihView>
    );
}
