import { Link, LinkProps } from 'expo-router';
import WihText from './WihText';

const WihLink = ({ style, children, href }: LinkProps<string>) => {
    return (
        <Link href={href}>
            <WihText style={style}>{children}</WihText>
        </Link>
    )
}

export default WihLink;