import {useThemeColor} from "@/hooks/useThemeColor";
import {Text, TextProps, TextStyle} from "react-native";

export const WihText = ({children, style, ...rest}: TextProps) => {
    const color = useThemeColor("text");

    return (
        <Text style={[{color}, style]} {...rest}>{children}</Text>
    );
}

export const WihTitle = ({children, style, ...rest}: TextProps) => {
    const color = useThemeColor("text");
    const titleStyle: TextStyle = {
        marginTop: 10,
        fontWeight: "bold",
        fontSize: 20,
        color
    }

    return (
        <Text style={[titleStyle, style]} {...rest}>{children}</Text>
    )
}