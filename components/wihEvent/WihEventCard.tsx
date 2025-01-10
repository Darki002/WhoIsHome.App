import React, {useCallback} from "react";
import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {useWihTheme} from "@/components/WihThemeProvider";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useRouter} from "expo-router";
import {EventType, WihEvent} from "@/constants/WihTypes/Event/WihEvent";
import {timeDisplayString} from "@/helper/datetimehelper";

interface EventCardProps {
    event: WihEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const theme = useWihTheme();
    const router = useRouter();

    const onEventPress = useCallback(() => {
        const eventType = event.EventType === "OneTimeEvent" ? "oneTime" : "repeated";
        router.push(`/protected/event/view/${eventType}/${event.Id}`);
    }, [event.Id, event.EventType]);

    const renderIcon = (eventType: EventType) => {
        switch (eventType) {
            case "OneTimeEvent":
                return <MaterialIcons name="event" size={24} color={theme.primary} />;
            case "RepeatedEvent":
                return <MaterialIcons name="event-repeat" size={24} color={theme.primary} />;
            default:
                return null;
        }
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: pressed ? theme.primary : theme.background },
                { borderColor: theme.primary },
            ]}
            onPress={() => onEventPress()}
        >
            <WihView style={styles.content} gap={10}>
                <WihView style={styles.iconContainer}>{renderIcon(event.EventType)}</WihView>
                <WihView style={styles.textContainer}>
                    <WihText style={styles.title}>{event.Title}</WihText>
                    <WihText>{event.Date?.toLocaleDateString()}</WihText>
                    <WihText>
                        {timeDisplayString(event.StartTime)} -{" "}
                        {timeDisplayString(event.EndTime)}
                    </WihText>
                </WihView>
            </WihView>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    content: {
        display:"flex",
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 10,
    },
    textContainer: {
        display: "flex",
        alignContent: "center"
    },
    title: {
        fontSize: 20
    }
});

export default EventCard;
