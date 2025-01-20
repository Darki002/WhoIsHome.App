import {useLocalSearchParams, useRouter} from "expo-router";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import React, {useCallback, useEffect, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihText";
import {RepeatedEvent, RepeatedEventDto, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import WihView from "@/components/WihView";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {Endpoints} from "@/constants/endpoints";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import useOnResponse from "@/components/pages/EventEdit/useOnResponse";
import {WihTextInput} from "@/components/input/WihTextInput";
import {WihDateInput} from "@/components/input/DateTime/WihDateInput";
import {WihTimeInput} from "@/components/input/DateTime/WihTimeInput";
import WihIconRow from "@/components/WihIconRow";
import {StyleSheet} from "react-native";

const options : Array<WihOption<PresenceType>> = [
    {value: "Unknown", displayTextLabel: Labels.presenceType.unknown},
    {value: "Late", displayTextLabel: Labels.presenceType.late},
    {value: "NotPresent", displayTextLabel: Labels.presenceType.notPresent}
];

export default function RepeatedEventView() {
    const {t} = useTranslation();
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();

    const response = useWihApiFocus<RepeatedEventModel>({
        endpoint: Endpoints.repeatedEvent.withId(id),
        method: "GET"
    });

    const [event, setEvent] = useState<RepeatedEvent | null>(new RepeatedEvent());
    useEffect(() => {
        if (!response || !response.response || response.hasError) {
            return;
        }
        const repeatedEvent = new RepeatedEvent(response?.response);
        setEvent(repeatedEvent);
    }, [response]);

    const updateEvent = (update: Partial<RepeatedEvent>) => {
        setEvent((prev) => ({...prev, ...update}));
    }

    const onResponse = useOnResponse(id);
    const callWihApi = useWihApiCallable<RepeatedEventDto>({
        endpoint: Endpoints.repeatedEvent.withId(id),
        method: "PATCH",
        onResponse
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => {
        if (!event) return;
        const body: RepeatedEventDto = {
            Title: event.Title!,
            FirstOccurrence: formatDate(event.FirstOccurrence!),
            LastOccurrence: formatDate(event.LastOccurrence!),
            StartTime: formatTime(event.StartTime!),
            EndTime: formatTime(event.EndTime!),
            PresenceType: event.PresenceType!,
            DinnerTime: event.DinnerTime ? formatTime(event.DinnerTime) : null
        }
        callWihApi(body);
    };

    if(!event) {
        return null;
    }

    const onDinnerTimeChange = (time: Date | undefined) => {
        const value = event.PresenceType === "Late" ? time : null;
        updateEvent({DinnerTime: value});
    }

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        updateEvent({PresenceType: presenceType});
        if (presenceType !== "Late") {
            updateEvent({DinnerTime: null});
        }
    }

    return (
        <EventEditLayout response={response} onCancel={onCancel} onUpdate={onUpdate}>
            <WihTextInput
                value={event.Title}
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => updateEvent({Title: t})}/>

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.firstOccurrence)}: </WihText>
                    <WihDateInput value={event.FirstOccurrence}
                                  onChange={d => updateEvent({FirstOccurrence: d})}/>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.lastOccurrence)}: </WihText>
                    <WihDateInput value={event.LastOccurrence}
                                  onChange={d => updateEvent({LastOccurrence: d})}/>
                </WihView>
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={event.StartTime} onChange={st => updateEvent({StartTime: st})}></WihTimeInput>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={event.EndTime} onChange={et => updateEvent({EndTime: et})}></WihTimeInput>
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihSingleChoice
                    value={event.PresenceType}
                    options={options}
                    direction="row"
                    onChange={onPresenceTypeChange}/>
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={event.DinnerTime}
                    disabled={event.PresenceType !== "Late"}
                    onChange={onDinnerTimeChange}/>
            </WihIconRow>
        </EventEditLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    labels: {
        fontWeight: "bold"
    }
});