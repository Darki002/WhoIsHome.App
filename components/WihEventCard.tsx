import {Pressable, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {useThemeColor} from "@/hooks/useThemeColor";

export interface EventProps {
    Id: number;
    Title: string;
    Date: Date;
    StartTime: Date;
    EndTime: Date;
    EventType: string;
}

export const WihEventCard = ({event} : {event: EventProps}) => {
    const borderColor = useThemeColor("border");

    const router = useRouter();
    function onEventPress(){
        // TODO: route to event view
    }

    return (
        <Pressable onPress={onEventPress} >
            <WihView style={[{borderColor}, styles.card]}>
                <WihTitle>{event.Title}</WihTitle>
                <WihText>Date: {event.Date.toDateString()}</WihText>
                <WihText>Time: {event.StartTime.toTimeString()}-{event.EndTime.toTimeString()}</WihText>
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