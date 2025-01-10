import React, {useCallback} from "react";
import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {useWihTheme} from "@/components/WihThemeProvider";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {useRouter} from "expo-router";
import {EventType, WihEvent} from "@/constants/WihTypes/Event/BaseTypes";

interface EventCardProps {
    event: WihEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const theme = useWihTheme();
    const router = useRouter();

    const onEventPress = useCallback(() => {
        const eventType = event.eventType === "OneTimeEvent" ? "oneTime" : "repeated";
        router.push(`/protected/event/view/${eventType}/${event.id}`);
    }, [event.id, event.eventType]);

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
                <WihView style={styles.iconContainer}>{renderIcon(event.eventType)}</WihView>
                <WihView style={styles.textContainer}>
                    <WihTitle>{event.title}</WihTitle>
                    <WihText>{new Date(event.date).toLocaleDateString()}</WihText>
                    <WihText>
                        {new Date(event.startTime).toLocaleTimeString()} -{" "}
                        {new Date(event.endTime).toLocaleTimeString()}
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
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
});

export default EventCard;
