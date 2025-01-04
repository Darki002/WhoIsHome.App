import {Pressable, StyleSheet} from "react-native";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {useThemeColor} from "@/hooks/useThemeColor";
import {timeStringToDate} from "@/helper/datetimehelper";
import {useRouter} from "expo-router";
import {useCallback} from "react";
import {WihEvent} from "@/constants/WihTypes/Event/BaseTypes";

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
        const eventType = event.eventType === "OneTimeEvent" ? "oneTime" : "repeated";
        router.push(`/protected/event/view/${eventType}/${event.id}`);
    }, [event.id, event.eventType]);

    const date = new Date(event.date);
    const startTime = timeStringToDate(event.startTime)!;
    const endTime = timeStringToDate(event.endTime)!;

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