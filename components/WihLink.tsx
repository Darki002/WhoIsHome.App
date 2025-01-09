import {Link, LinkProps} from 'expo-router';
import {useWihTheme} from "@/components/WihThemeProvider";
import {TextStyle} from "react-native";

const WihLink = ({style, children, href}: LinkProps) => {
    const theme = useWihTheme();

    const colorStyle: TextStyle = {
        color: theme.link
    }

    return (
        <Link href={href} style={[colorStyle, style]}>
            {children}
        </Link>
    )
}

export default WihLink;