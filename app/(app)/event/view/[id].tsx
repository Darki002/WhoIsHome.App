import {WihText} from "@/components/WihComponents/display/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import React, {useCallback, useState} from "react";
import {Endpoints} from "@/constants/endpoints";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import Labels from "@/constants/locales/Labels";
import WihView from "@/components/WihComponents/view/WihView";
import {dateStringToDate, formatDate, timeDisplayString, timeStringToDate} from "@/helper/datetimehelper";
import {StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import useWihApiFocus, {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";
import {EventGroup, EventGroupModel} from "@/constants/WihTypes/Event/EventGroup";
import {EventInstance, EventInstanceModel} from "@/constants/WihTypes/Event/EventInstance";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {WihButton, WihIconButton, WihTextButton} from "@/components/WihComponents/input/WihButton";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";

type EventInstanceQueryParams = {
    start: string;
    weeks: number;
}

function EventGroupView({response}: {response: EventGroupModel}) {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const router = useRouter();

    const [showInstances, setShowInstances] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const {data, error, isLoading, refresh} = useWihApiFocus<EventInstanceModel[], EventInstanceQueryParams>({
        endpoint: Endpoints.eventGroup.instance.withId(response.id),
        defaultQueryParams: { start: formatDate(date), weeks: 2 },
        method: "GET"
    });

    const deleteEvent = useWihApi({
        endpoint: Endpoints.eventGroup.withId(`${response.id}`),
        method: "DELETE"
    });

    const onEdit = useCallback(() => {
        router.push(`/(app)/event/edit/${response.id}`);
    }, [response.id]);

    const event = new EventGroup(response);

    const handleToggleInstances = useCallback(() => {
        setShowInstances(!showInstances);
    }, [showInstances]);

    const canGoBack = React.useMemo(() => {
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 14);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return prevDate >= today;
    }, [date]);

    const goToNextPeriod = useCallback(() => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 14);
        setDate(nextDate);
        refresh({ start: formatDate(nextDate), weeks: 2 });
    }, [date]);

    const goToPreviousPeriod = useCallback(() => {
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 14);
        const today = new Date();

        if (prevDate < today) {
            setDate(today);
        } else {
            setDate(prevDate);
        }
        refresh({ start: formatDate(prevDate), weeks: 2 });
    }, [date]);

    const resetToToday = useCallback(() => {
        const date = new Date();
        setDate(date);
        refresh({ start: formatDate(date), weeks: 2 });
    }, []);

    const isInstanceModified = (instance: EventInstanceModel): boolean => {
        const instanceDate = new Date(instance.date);
        const expectedWeekDay = event.weekDays.includes(instanceDate.getDay());

        if (!expectedWeekDay) return true;
        if (timeStringToDate(instance.startTime)?.getTime() !== event.startTime?.getTime()) return true;
        if (timeStringToDate(instance.endTime)?.getTime() !== event.endTime?.getTime()) return true;
        if (dateStringToDate(instance.dinnerTime)?.getTime() !== event.dinnerTime?.getTime()) return true;
        return instance.presenceType !== event.presenceType;
    };

    const getWeekDays = () => {
        const weekDayIndexes = [1, 2, 3, 4, 5, 6, 0];
        return weekDayIndexes.map(i => {
            const isActive = event.weekDays.filter(w => w == i).length > 0;
            return (
                <WihView
                    key={i}
                    style={[
                        styles.weekDayOption,
                        {borderColor: isActive ? theme.primary : theme.border},
                        isActive && {
                            backgroundColor: theme.primary,
                        },
                    ]}
                >
                    <WihText
                        style={{
                            color: isActive ? theme.textInverse : theme.text,
                        }}
                    >
                        {t(Labels.weekdays.shortByNumber[i])}
                    </WihText>
                </WihView>
            )
        });
    }

    return (
        <EventViewLayout title={event.title} userId={event.userId} onEdit={onEdit} onDelete={deleteEvent} onRefresh={refresh}>
            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihText>{event.startDate.toLocaleDateString()}</WihText>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                    <WihText>{event.endDate?.toLocaleDateString() ?? "N/A"}</WihText>
                </WihView>
            </WihIconRow>

            <WihView style={[styles.container, {gap: 10, marginBottom: 20}]}>
                {getWeekDays()}
            </WihView>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihText>{timeDisplayString(event.startTime)}</WihText>
                </WihView>
                {event.endTime && (
                    <WihView style={styles.container}>
                        <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                        <WihText>{timeDisplayString(event.endTime)}</WihText>
                    </WihView>
                )}
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihText>{event.presenceType}</WihText>
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihText>{event.dinnerTime ? timeDisplayString(event.dinnerTime) : "-"}</WihText>
            </WihIconRow>

            <WihIconRow name="event-note" flexDirection="column">
                <WihButton
                    onPress={handleToggleInstances}
                    style={styles.instanceToggle}
                >
                    {showInstances
                        ? t(Labels.actions.hideInstances)
                        : t(Labels.actions.viewInstances)}
                </WihButton>
            </WihIconRow>
            <WihView style={styles.eventPreviewContainer}>
                {showInstances && (
                    <WihView style={styles.instanceSection}>
                        {/* Period Navigation */}
                        <WihView style={styles.navigationContainer}>
                            <WihIconButton onPress={goToPreviousPeriod} disabled={!canGoBack} buttonStyle={styles.navButton} size={20} name="arrow-back" />
                            <WihIconButton onPress={resetToToday} buttonStyle={styles.todayButton} size={20} name="today" />
                            <WihIconButton onPress={goToNextPeriod} buttonStyle={styles.navButton} size={20} name="arrow-forward" />
                        </WihView>

                        {/* Current Period Display */}
                        <WihText style={styles.periodLabel}>
                            {date.toLocaleDateString()} - {new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </WihText>

                        {/* Loading State */}
                        {isLoading && (
                            <WihView style={styles.instanceList}>
                                <WihText>{t(Labels.message.loading)}</WihText>
                            </WihView>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <WihView style={styles.instanceList}>
                                <WihErrorView error={error} refresh={refresh} />
                            </WihView>
                        )}

                        {/* Instances List */}
                        {!isLoading && !error && data && (
                            <WihView style={styles.instanceList}>
                                {data.length === 0 ? (
                                    <WihText>{t(Labels.message.noUpcomingInstances)}</WihText>
                                ) : (
                                    data.map((instance) => {
                                        const instanceDate = new Date(instance.date);
                                        const isModified = isInstanceModified(instance);

                                        return (
                                            <WihTextButton
                                                key={instance.date}
                                                onPress={() => router.setParams({date: instance.date})}
                                                style={[
                                                    styles.instanceButton,
                                                    isModified && {
                                                        borderWidth: 2,
                                                        borderStyle: 'dashed',
                                                        borderColor: theme.primary,
                                                    }
                                                ]}
                                            >
                                                <WihView style={styles.instanceButtonContent}>
                                                    <WihView style={{flex: 1}}>
                                                        <WihText style={styles.instanceDate}>
                                                            {instanceDate.toLocaleDateString()} - {instanceDate.toLocaleDateString(undefined, {weekday: 'short'})}
                                                        </WihText>
                                                        <WihText style={styles.instanceTime}>
                                                            {timeDisplayString(timeStringToDate(instance.startTime))}
                                                            {instance.endTime && ` - ${timeDisplayString(timeStringToDate(instance.endTime))}`}
                                                        </WihText>
                                                    </WihView>
                                                    {isModified && (
                                                        <WihText style={[styles.modifiedBadge, {color: theme.primary}]}>
                                                            {t(Labels.labels.modified)}
                                                        </WihText>
                                                    )}
                                                </WihView>
                                            </WihTextButton>
                                        );
                                    })
                                )}
                            </WihView>
                        )}
                    </WihView>
                )}
            </WihView>
        </EventViewLayout>
    )
}

function EventInstanceView({response, refresh}: {response: EventInstanceModel, refresh: () => void}) {
    const {t} = useTranslation();
    const router = useRouter();

    const deleteEvent = useWihApi({
        endpoint: Endpoints.eventGroup.withId(`${response.id}`),
        method: "DELETE"
    });

    const onEdit = useCallback(() => {
        router.push(`/(app)/event/edit/${response.id}?date=${response.date}`);
    }, [response.id]);

    const event = new EventInstance(response);

    return (
        <EventViewLayout title={event.title} userId={event.userId} onEdit={onEdit} onDelete={deleteEvent} onRefresh={refresh}>
            <WihIconRow name="info" flexDirection="column">
                <WihText>{t(Labels.message.viewInstance)}</WihText>
                <WihTextButton onPress={() => router.setParams({date: undefined})}>
                    {t(Labels.actions.viewGroup)}
                </WihTextButton>
            </WihIconRow>

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.date)}: </WihText>
                    <WihText>{event.date.toLocaleDateString()}</WihText>
                </WihView>
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihText>{timeDisplayString(event.startTime)}</WihText>
                </WihView>
                {event.endTime && (
                    <WihView style={styles.container}>
                        <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                        <WihText>{timeDisplayString(event.endTime)}</WihText>
                    </WihView>
                )}
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihText>{event.presenceType}</WihText>
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihText>{event.dinnerTime ? timeDisplayString(event.dinnerTime) : "-"}</WihText>
            </WihIconRow>
        </EventViewLayout>
    )
}

const CIRCLE_SIZE = 36;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row"
    },
    labels: {
        fontWeight: "bold"
    },
    weekDayOption: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2
    },
    instanceToggle: {
        alignSelf: 'flex-start',
    },
    instanceSection: {
        marginTop: 12,
        gap: 12,
    },
    navigationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navButton: {
        flex: 1,
        alignItems: 'center',
    },
    todayButton: {
        flex: 1,
        alignItems: 'center',
    },
    periodLabel: {
        textAlign: 'center',
        fontSize: 12,
        opacity: 0.7,
    },
    instanceList: {
        gap: 8,
    },
    instanceButton: {
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
    },
    instanceButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    instanceDate: {
        fontWeight: '600',
    },
    instanceTime: {
        fontSize: 12,
        opacity: 0.7,
        marginTop: 4,
    },
    modifiedBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    eventPreviewContainer: {
        padding: 30,
    }
});

export default function () {
    const { id, date } = useLocalSearchParams<{ id: string, date?: string }>();

    if(!date){
        return <WihApiFocus Component={EventGroupView} endpoint={Endpoints.eventGroup.withId(id)} method="GET" />
    }

    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceView} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
}