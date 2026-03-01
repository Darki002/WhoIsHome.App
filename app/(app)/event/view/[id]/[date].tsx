import {useLocalSearchParams, useRouter} from "expo-router";
import {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";
import {Endpoints} from "@/constants/endpoints";
import {dateStringToDate, timeDisplayString} from "@/helper/datetimehelper";
import React, {useCallback} from "react";
import {StyleSheet} from "react-native";
import {EventInstance, EventInstanceModel} from "@/constants/WihTypes/Event/EventInstance";
import {useTranslation} from "react-i18next";
import useWihApi from "@/hooks/useWihApi";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {WihText} from "@/components/WihComponents/display/WihText";
import Labels from "@/constants/locales/Labels";
import {WihTextButton} from "@/components/WihComponents/input/WihButton";
import WihView from "@/components/WihComponents/view/WihView";

export default function () {
    const { id, date } = useLocalSearchParams<{ id: string, date: string }>();
    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceView} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
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

    console.log(`Event Date ${event.date}`);

    return (
        <EventViewLayout title={event.title} userId={event.userId} onEdit={onEdit} onDelete={deleteEvent} onRefresh={refresh}>
            <WihIconRow name="info" flexDirection="column">
                <WihText>{t(Labels.message.viewInstance)}</WihText>
                <WihTextButton onPress={() => router.push(`(app)/event/view/${event.eventGroupId}`)}>
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
    }
});