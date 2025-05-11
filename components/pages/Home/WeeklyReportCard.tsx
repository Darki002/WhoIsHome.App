import React from 'react';
import { StyleSheet } from 'react-native';
import {WeeklyReport} from "@/constants/WihTypes/WeeklyReport";
import WihView from "@/components/WihComponents/view/WihView";
import {WihAvatar} from "@/components/WihComponents/icon/WihAvatar";
import { WihText } from '@/components/WihComponents/display/WihText';
import {formatDate} from "@/helper/datetimehelper";

interface Props {
    report: WeeklyReport;
}

export default function WeeklyReportCard({ report }: Props) {
    return (
        <WihView style={styles.card}>
            {/* Header: avatar + name */}
            <WihView style={styles.header}>
                <WihAvatar name={report.User.username} size={40} style={styles.avatar} />
                <WihText style={styles.name}>{report.User.username}</WihText>
            </WihView>

            {/* 7-day overview row */}
            <WihView style={styles.daysRow}>
                {report.DailyOverviews.map(day => (
                    <WihView style={styles.dayCell} key={day.Date.toISOString()}>
                        <WihText style={styles.dayLabel}>{formatDate(day.Date)}</WihText>
                        <WihView
                            style={[
                                styles.dot,
                                day.IsAtHome ? styles.atHome : styles.away,
                            ]}
                        />
                        {day.DinnerTime && (
                            <WihText style={styles.time}>
                                {formatDate(day.DinnerTime)}
                            </WihText>
                        )}
                    </WihView>
                ))}
            </WihView>
        </WihView>
    );
}

const DOT_SIZE = 10;
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
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
    atHome: {
        backgroundColor: '#52C41A',
    },
    away: {
        backgroundColor: '#D9D9D9',
    },
    time: {
        fontSize: 10,
        color: '#555',
    },
});
