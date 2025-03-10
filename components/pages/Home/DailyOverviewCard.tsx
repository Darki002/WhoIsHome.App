import {DailyOverview} from "@/constants/WihTypes/DailyOverview";
import {Pressable, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {MaterialIcons} from "@expo/vector-icons";
import React from "react";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {timeDisplayString} from "@/helper/datetimehelper";

export interface DailyOverviewProps {
    overview: DailyOverview;
}

export const DailyOverviewCard = ({overview}: DailyOverviewProps) => {
    const theme = useWihTheme();
    const router = useRouter();

    const onOverviewPress = () => {
        router.push(`/(app)/user/${overview.User.id}`);
    }

    const renderIcon = (isAtHome: boolean) => {
        return isAtHome
            ? <MaterialIcons name="check-circle" size={24} color="#2b802b"/>
            : <MaterialIcons name="cancel" size={24} color="#913737"/>;
    };

    return (
        <Pressable
            style={({pressed}) => [
                styles.card,
                {backgroundColor: pressed ? theme.primary : theme.background},
                {borderColor: theme.primary},
            ]}
            onPress={() => onOverviewPress()}
        >
            <WihView style={styles.content} gap={10}>
                <WihView style={styles.iconContainer}>{renderIcon(overview.IsAtHome)}</WihView>
                <WihView style={styles.textContainer}>
                    <WihText style={styles.title}>{overview.User.username}</WihText>
                    <DinnerTimeCard dinnerTime={overview.DinnerTime} isAtHome={overview.IsAtHome}/>
                </WihView>
            </WihView>
        </Pressable>
    );
}

const DinnerTimeCard = ({dinnerTime, isAtHome}: { dinnerTime: Date | null, isAtHome: boolean }) => {
    const theme = useWihTheme();
    const {t} = useTranslation();

    if (!isAtHome) return null;

    const displayText = !dinnerTime
        ? t(Labels.dailyOverviewCard.unknownTime)
        : timeDisplayString(dinnerTime);

    return (
        <WihView style={styles.dinnerTimeContainer} gap={5}>
            <MaterialIcons name="schedule" size={18} color={theme.primary}/>
            <WihText>{displayText}</WihText>
        </WihView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    content: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 10,
    },
    textContainer: {
        display: "flex",
        alignContent: "center",
        gap: 3
    },
    title: {
        fontSize: 20
    },
    dinnerTimeContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row"
    }
});