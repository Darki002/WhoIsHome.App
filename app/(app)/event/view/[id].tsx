import {WihText} from "@/components/WihComponents/display/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import React, {useCallback} from "react";
import {Endpoints} from "@/constants/endpoints";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import Labels from "@/constants/locales/Labels";
import WihView from "@/components/WihComponents/view/WihView";
import {dateStringToDate, timeDisplayString} from "@/helper/datetimehelper";
import {StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";
import {EventGroup, EventGroupModel} from "@/constants/WihTypes/Event/EventGroup";
import {EventInstance, EventInstanceModel} from "@/constants/WihTypes/Event/EventInstance";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {WihTextButton} from "@/components/WihComponents/input/WihButton";

function EventGroupView({response}: {response: EventGroupModel}) {
    const theme = useWihTheme();
    const {t} = useTranslation();
    const router = useRouter();

    const deleteEvent = useWihApi({
        endpoint: Endpoints.eventGroup.withId(`${response.id}`),
        method: "DELETE"
    });

    const onEdit = useCallback(() => {
        router.push(`/(app)/event/edit/${response.id}`);
    }, [response.id]);

    const event = new EventGroup(response);

    const getWeekDays = () => {
        const weekDayIndexes = [1, 2, 3, 4, 5, 6, 0];
        return weekDayIndexes.map(i => {
            const isActive = event.weekDays.filter(w => w == i).length > 0;
            return (
                <WihView
                    key={i}
                    style={[
                        styles.weekDayOption,
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
        <EventViewLayout title={event.title} userId={event.userId} onEdit={onEdit} onDelete={deleteEvent}>
            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihText>{event.startDate.toLocaleDateString()}</WihText>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                    <WihText>{event.endDate?.toLocaleDateString() ?? "N/A"}</WihText>
                </WihView>
                <WihView style={styles.container}>
                    {getWeekDays()}
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

function EventInstanceView({response}: {response: EventInstanceModel}) {
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
        <EventViewLayout title={event.title} userId={event.userId} onEdit={onEdit} onDelete={deleteEvent}>
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

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row"
    },
    labels: {
        fontWeight: "bold"
    },
    weekDayOption: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray",
        alignItems: "center",
    },
});

export default function () {
    const { id, date } = useLocalSearchParams<{ id: string, date?: string }>();

    if(!date){
        return <WihApiFocus Component={EventGroupView} endpoint={Endpoints.eventGroup.withId(id)} method="GET" />
    }

    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceView} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
}