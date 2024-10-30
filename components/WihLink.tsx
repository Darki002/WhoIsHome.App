import { Link, LinkProps } from 'expo-router';
import { WihText } from './WihText';
import {useThemeColor} from "@/hooks/useThemeColor";

const WihLink = ({ style, children, href }: LinkProps<string>) => {
    const color = useThemeColor("text");

    return (
        <Link href={href} style={[{ color }, style]}>
            {children}
        </Link>
    )
}

export default WihLink;