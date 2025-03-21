import {WihText} from "@/components/WihComponents/display/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import React, {useCallback} from "react";
import {RepeatedEvent, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";
import {Endpoints} from "@/constants/endpoints";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import Labels from "@/constants/locales/Labels";
import WihView from "@/components/WihComponents/view/WihView";
import {timeDisplayString} from "@/helper/datetimehelper";
import {StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";

function RepeatedEventView({response}: {response: RepeatedEventModel}) {
    const {t} = useTranslation();
    const router = useRouter();

    const deleteEvent = useWihApi({
        endpoint: Endpoints.repeatedEvent.withId(`${response.id}`),
        method: "DELETE"
    });

    const onEdit = useCallback(() => {
        router.push(`/(app)/event/edit/repeated/${response.id}`);
    }, [response.id]);

    const event = new RepeatedEvent(response);

    return (
        <EventViewLayout event={event} onEdit={onEdit} onDelete={deleteEvent}>
            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.firstOccurrence)}: </WihText>
                    <WihText>{event.FirstOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.lastOccurrence)}: </WihText>
                    <WihText>{event.LastOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>
                </WihView>
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihText>{event.StartTime ? timeDisplayString(event.StartTime) : "N/A"}</WihText>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihText>{event.EndTime ? timeDisplayString(event.EndTime) : "N/A"}</WihText>
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihText>{event.PresenceType ?? "Missing"}</WihText>
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihText>{event.DinnerTime ? timeDisplayString(event.DinnerTime) : "N/A"}</WihText>
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

export default function () {
    const {id} = useLocalSearchParams<{ id: string }>();
    return <WihApiFocus Component={RepeatedEventView} endpoint={Endpoints.repeatedEvent.withId(id)} method="GET" />
}