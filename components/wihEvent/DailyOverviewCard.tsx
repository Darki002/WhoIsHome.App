import {DailyOverview} from "@/constants/WihTypes/DailyOverview";
import {Pressable, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {MaterialIcons} from "@expo/vector-icons";
import React from "react";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";

export interface DailyOverviewProps {
    overview: DailyOverview;
}

export const DailyOverviewCard = ({overview}: DailyOverviewProps) => {
    const {t} = useTranslation();
    const theme = useWihTheme();
    const router = useRouter();

    const onOverviewPress = () => {
        router.push(`/protected/user/${overview.User.id}`)
    }

    const renderIcon = (isAtHome : boolean) => {
        return isAtHome
            ? <MaterialIcons name="check-circle" size={24} color="#ff0000" />
            : <MaterialIcons name="cancel" size={24} color="#00ff00" />;
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: pressed ? theme.primary : theme.background },
                { borderColor: theme.primary },
            ]}
            onPress={() => onOverviewPress()}
        >
            <WihView style={styles.content} gap={10}>
                <WihView style={styles.iconContainer}>{renderIcon(overview.IsAtHome)}</WihView>
                <WihView style={styles.textContainer}>
                    <WihText style={styles.title}>{overview.User.username}</WihText>
                    {
                        overview.IsAtHome ? (
                            <WihText>
                                {overview.DinnerTime?.toLocaleDateString() ?? t(Labels.other.unknownTime)}
                            </WihText>
                        ) : null
                    }
                </WihView>
            </WihView>
        </Pressable>
    );
}

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