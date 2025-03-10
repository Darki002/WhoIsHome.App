import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback} from "react";
import {WihText} from "@/components/WihComponents/display/WihText";
import EventViewLayout from "@/components/pages/EventView/EventViewLayout";
import {Endpoints} from "@/constants/endpoints";
import WihView from "@/components/WihComponents/view/WihView";
import {timeDisplayString} from "@/helper/datetimehelper";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {OneTimeEvent, OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";
import {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";

function OneTimeEventViewComponent({response}: {response: OneTimeEventModel}) {
    const {t} = useTranslation();
    const router = useRouter();

    const deleteEvent = useWihApi({
        endpoint: Endpoints.oneTimeEvent.withId(`${response.id}`),
        method: "DELETE",
    });

    const onEdit = useCallback(() => {
        router.push(`/protected/event/edit/oneTime/${response.id}`);
    }, [response.id]);

    const event = new OneTimeEvent(response);

    return (
        <EventViewLayout event={event} onEdit={onEdit} onDelete={deleteEvent}>
            <WihIconRow name="date-range" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.date)}: </WihText>
                <WihText>{event.Date?.toLocaleDateString() ?? "N/A"}</WihText>
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
    );
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

export default function OneTimeEventView() {
    const {id} = useLocalSearchParams<{ id: string }>();

    return WihApiFocus<OneTimeEventModel>({
        endpoint: Endpoints.oneTimeEvent.withId(id),
        method: "GET",
        Component: OneTimeEventViewComponent
    });
}