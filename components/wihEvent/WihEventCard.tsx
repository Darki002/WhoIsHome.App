import {Pressable, StyleSheet} from "react-native";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {useThemeColor} from "@/hooks/useThemeColor";
import {WihEvent} from "@/constants/WihTypes";
import {timeStringToDate} from "@/components/helper/datetimehelper";
import {useRouter} from "expo-router";
import {useCallback} from "react";

export interface WihEventCardProps {
    id: number;
    title: string;
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    eventType: string;
}

export default function WihEventCard({event}: { event: WihEvent }) {
    const borderColor = useThemeColor("border");
    const router = useRouter();

    const onEventPress = useCallback(() => {
        router.push(`/event/view/repeated/${event.id}`);
    }, [event.id]);

    const date = new Date(event.date);
    const startTime = timeStringToDate(event.startTime);
    const endTime = timeStringToDate(event.startTime);

    return (
        <Pressable onPress={onEventPress}>
            <WihView style={[{borderColor}, styles.card]}>
                <WihTitle>{event.title}</WihTitle>
                <WihText>Date: {date.toLocaleDateString()}</WihText>
                <WihText>Time: {startTime.toLocaleTimeString()}-{endTime.toLocaleTimeString()}</WihText>
            </WihView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 100,
        borderStyle: "solid",
        borderWidth: 3
    }
})