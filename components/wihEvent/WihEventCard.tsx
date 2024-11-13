import {Pressable, StyleSheet} from "react-native";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {useThemeColor} from "@/hooks/useThemeColor";
import {WihEvent} from "@/constants/WihTypes";

export default function WihEventCard({event} : {event: WihEvent}) {
    const borderColor = useThemeColor("border");

    function onEventPress(){
        // TODO: route to event view
        // Can edit the Event there and also see more details (mb more usefull later)
        // Idea: like pop up View that is on top of the current view, so you can also go back with arrow back
    }

    return (
        <Pressable onPress={onEventPress} >
            <WihView style={[{borderColor}, styles.card]}>
                <WihTitle>{event.title}</WihTitle>
                <WihText>Date: {event.date.toDateString()}</WihText>
                <WihText>Time: {event.startTime.toTimeString()}-{event.endTime.toTimeString()}</WihText>
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