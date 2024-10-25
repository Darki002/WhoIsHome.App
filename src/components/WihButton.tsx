import { Button } from "react-native";

export interface WihButtonProps {
    onPress?: () => void | Promise<void>;
    children: string;
}

export const WihButton = ({ children, onPress }: WihButtonProps) => {
    return <Button title={children} onPress={onPress} />
}