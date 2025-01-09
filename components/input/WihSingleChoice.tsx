import {StyleSheet, View} from "react-native";
import {WihButton} from "@/components/input/WihButton";
import {useWihTheme} from "@/components/WihThemeProvider";

export type WihOption<T> = {
    value?: T;
    display: string;
}

export interface WihSingleChoiceProps<T> {
    value?: T;
    options: Array<WihOption<T>>;
    direction?: "row" | "column";
    onChange: (value: T | undefined) => void;
}

export function WihSingleChoice<T>({value, options, direction, onChange}: WihSingleChoiceProps<T>) {
    const theme = useWihTheme();
    const flex = styles[direction ?? "column"];

    return (
        <View style={[{backgroundColor: theme.background}, flex]}>
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

const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row"
    },
    column: {
        display: "flex",
        flexDirection: "column"
    }
})

interface OptionButtonProps<T> {
    value?: T;
    display: string;
    isSelected: boolean;
    onChange: (value: T | undefined) => void;
}

function OptionButton<T>({value, display, isSelected, onChange}: OptionButtonProps<T>) {
    const theme = useWihTheme();

    const backgroundColor = isSelected ? theme.primary : theme.secondary;

    return (
        <WihButton onPress={() => onChange(value)} style={{backgroundColor}}>{display}</WihButton>
    );
}