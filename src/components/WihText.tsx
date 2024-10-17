import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, TextProps } from "react-native";

const WihText = ({ children, style, ...rest }: TextProps) => {
    const color = useThemeColor("text");
    console.log(color);

    return (
        <Text style={[{ color }, style]} {...rest}>{children}</Text>
    );
}

export default WihText;