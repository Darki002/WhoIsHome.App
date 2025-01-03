import {View} from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";
import {WihButton} from "@/components/input/WihButton";

export type WihOption<T> = {
    value?: T;
    display: string;
}

export interface WihSingleChoiceProps<T> {
    value?: T;
    options: Array<WihOption<T>>;
    onChange: (value: T | undefined) => void;
}

export function WihSingleChoice<T>({value, options, onChange}: WihSingleChoiceProps<T>) {
    const backgroundColor = useThemeColor('background');
    return (
        <View style={{backgroundColor, flex: 2}}>
            {options.map((o, i) =>
                <OptionButton
                    key={i}
                    value={o.value}
                    display={o.display}
                    isSelected={o.value === value}
                    onChange={onChange}/>
            )}
        </View>
    );
}

interface OptionButtonProps<T> {
    value?: T;
    display: string;
    isSelected: boolean;
    onChange: (value: T | undefined) => void;
}

function OptionButton<T>({value, display, isSelected, onChange}: OptionButtonProps<T>) {
    const primary = useThemeColor('primary');
    const secondary = useThemeColor('secondary');

    const backgroundColor = isSelected ? primary : secondary;

    return (
        <WihButton onPress={() => onChange(value)} style={{backgroundColor}}>{display}</WihButton>
    );
}