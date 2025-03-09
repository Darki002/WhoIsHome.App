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
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/helper/fetch/WihResponse";
import {OneTimeEvent, OneTimeEventModel} from "@/constants/WihTypes/Event/OneTimeEvent";
import {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";

function OneTimeEventViewComponent({response}: {response: OneTimeEventModel}) {
    const {t} = useTranslation();
    const router = useRouter();

    const onResponse = useCallback((r: WihResponse<{}> | null) => {
        if(r && r.isValid()){
            router.back();
        }
    }, []);

    const deleteEvent = useWihApiCallable({
        endpoint: Endpoints.oneTimeEvent.withId(`${response.id}`),
        method: "DELETE",
        onResponse: onResponse
    });

    const onEdit = useCallback(() => {
        router.push(`/protected/event/edit/oneTime/${response.id}`);
    }, [response.id]);

    const event = new OneTimeEvent(response);

    return (
        <EventViewLayout event={response} onEdit={onEdit} onDelete={deleteEvent}>
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