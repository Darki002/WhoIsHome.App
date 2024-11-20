import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, TextInputProps } from "react-native";

export const WihTextInput = ({ value, onChangeText, style, ...rest }: TextInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");
    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} style={[{ color, borderColor }, style]} {...rest} />
}

export const WihUsernameInput = ({ value, onChangeText, style, ...rest }: TextInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");
    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} autoComplete="username" placeholder="UserName" style={[{ color, borderColor }, style]} {...rest} />
}

export const WihEmailInput = ({ value, onChangeText, style, ...rest }: TextInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");
    return <TextInput inputMode="email" value={value} onChangeText={onChangeText} autoComplete="email" placeholder="Email" style={[{ color, borderColor }, style]} {...rest} />
}

export type WihPasswordInputProps = TextInputProps & {
    autoCompleteType: "new" | "current";
}

export const WihPasswordInput = ({ autoCompleteType, value, onChangeText, style, ...rest }: WihPasswordInputProps) => {
    const color = useThemeColor("text");
    const borderColor = useThemeColor("border");

    let type: TextInputProps["autoComplete"] = undefined;
    switch (autoCompleteType) {
        case "new":
            type = "new-password";
            break;
        case "current":
            type = "current-password";
            break;
        default:
            type = "current-password";
            break;
    }

    return <TextInput inputMode="text" value={value} onChangeText={onChangeText} autoComplete={type} placeholder="Password" secureTextEntry style={[{ color, borderColor }, style]} {...rest} />
}