import {Text, TextProps, TextStyle} from "react-native";
import {useWihTheme} from "@/components/WihThemeProvider";

export const WihText = ({children, style, ...rest}: TextProps) => {
    const theme = useWihTheme();

    return (
        <Text style={[{color: theme.text}, style]} {...rest}>{children}</Text>
    );
}

export const WihTitle = ({children, style, ...rest}: TextProps) => {
    const theme = useWihTheme();

    const titleStyle: TextStyle = {
        marginTop: 10,
        fontWeight: "bold",
        fontSize: 20,
        color: theme.text
    }

    return (
        <Text style={[titleStyle, style]} {...rest}>{children}</Text>
    )
}