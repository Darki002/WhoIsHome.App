import {WihText} from "@/components/WihComponents/display/WihText";
import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
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
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/helper/fetch/WihResponse";
import WihLoading from "@/components/WihComponents/feedback/WihLoading";

export default function RepeatedEventView() {
    const {t} = useTranslation();
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();

    const onResponse = useCallback((response: WihResponse<{}> | null) => {
        if(response && response.isValid()){
            router.back();
        }
    }, []);

    const deleteEvent = useWihApiCallable({
        endpoint: Endpoints.repeatedEvent.withId(id),
        method: "DELETE",
        onResponse: onResponse
    });

    const [response, refresh] = useWihApiFocus<RepeatedEventModel>({
        endpoint: Endpoints.repeatedEvent.withId(id),
        method: "GET"
    });

    const onEdit = useCallback(() => {
        router.push(`/protected/event/edit/repeated/${id}`);
    }, [id]);

    if (!response) {
        return (
            <WihView center="full">
                <WihLoading />
            </WihView>
        )
    }

    if (!response.isValid() || !response.data) {
        return <WihErrorView response={response!} refresh={refresh} />
    }

    const event = new RepeatedEvent(response.data);

    return (
        <EventViewLayout response={response} onEdit={onEdit} onDelete={deleteEvent}>
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