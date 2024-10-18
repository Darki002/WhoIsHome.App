import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TextProps } from "react-native";

export const WihText = ({ children, style, ...rest }: TextProps) => {
    const color = useThemeColor("text");

    return (
        <Text style={[{ color }, style]} {...rest}>{children}</Text>
    );
}