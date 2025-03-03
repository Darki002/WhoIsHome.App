import React, {FC, useState} from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

type WihTextInputProps = TextInputProps & {
    style?: ViewStyle | ViewStyle[];
};

export const WihTextInput: FC<WihTextInputProps> = ({
                                                              value,
                                                              placeholder,
                                                              onChangeText,
                                                              style,
                                                              ...rest
                                                          }) => {
    const theme = useWihTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <TextInput
            inputMode="text"
            value={value}
            placeholder={placeholder}
            placeholderTextColor={theme.placeholder}
            onChangeText={onChangeText}
            style={[
                styles.input,
                {
                    color: theme.text,
                    borderColor: isFocused ? theme.primary : theme.border,
                },
                style,
            ]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
    },
});
