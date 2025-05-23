import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {WeeklyReport} from "@/constants/WihTypes/WeeklyReport";
import WihView from "@/components/WihComponents/view/WihView";
import {WihAvatar} from "@/components/WihComponents/icon/WihAvatar";
import { WihText } from '@/components/WihComponents/display/WihText';
import {timeDisplayString} from "@/helper/datetimehelper";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useRouter} from "expo-router";

interface Props {
    report: WeeklyReport;
}

export default function WeeklyReportCard({ report }: Props) {
    const theme = useWihTheme();
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <Pressable onPress={() => router.push(`/(app)/user/${report.User.id}`)} style={[
            styles.card,
            { borderColor: theme.primary, backgroundColor: theme.background }
        ]}>
            <WihView style={styles.header}>
                <WihAvatar name={report.User.username} size={40} style={styles.avatar} />
                <WihText style={styles.name}>{report.User.username}</WihText>
            </WihView>
            <WihView style={styles.daysRow}>
                {report.DailyOverviews.map(day => (
                    <WihView style={styles.dayCell} key={day.Date.toISOString()}>
                        <WihText style={styles.dayLabel}>{t(Labels.weekdays.shortByNumber[day.Date.getDay()])}</WihText>
                        <WihView
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: day.IsAtHome
                                        ? day.DinnerTime
                                            ? theme.dinner
                                            : theme.atHome
                                        : theme.away
                                }
                            ]}
                        />
                        {day.DinnerTime && (
                            <WihText style={styles.time}>
                                {timeDisplayString(day.DinnerTime)}
                            </WihText>
                        )}
                    </WihView>
                ))}
            </WihView>
        </Pressable>
    );
}

const DOT_SIZE = 10;
const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        marginRight: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayCell: {
        alignItems: 'center',
        width: 32,
    },
    dayLabel: {
        fontSize: 10,
        marginBottom: 4,
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        marginBottom: 4,
    },
    time: {
        fontSize: 10,
        color: '#555',
    },
});
