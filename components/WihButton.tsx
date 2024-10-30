import { Button } from "react-native";
import {useThemeColor} from "@/hooks/useThemeColor";

export interface WihButtonProps {
    onPress?: () => void | Promise<void>;
    children: string;
}

export const WihButton = ({ children, onPress }: WihButtonProps) => {
    const color = useThemeColor("primary");
    return <Button title={children} onPress={onPress} color={color} />
}