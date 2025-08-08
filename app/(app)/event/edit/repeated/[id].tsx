import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useEffect, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihComponents/display/WihText";
import {RepeatedEvent, RepeatedEventDto, RepeatedEventModel} from "@/constants/WihTypes/Event/RepeatedEvent";
import WihView from "@/components/WihComponents/view/WihView";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import {WihOption} from "@/components/WihComponents/input/WihSingleChoice";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {Endpoints} from "@/constants/endpoints";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import useOnResponse from "@/components/pages/EventEdit/useOnResponse";
import {WihTextInput} from "@/components/WihComponents/input/WihTextInput";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {StyleSheet} from "react-native";
import {WihPicker} from "@/components/WihComponents/input/WihPicker";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";
import {WihDateInput} from "@/components/WihComponents/input/datetime/WihDateInput";
import {WihTimeInput} from "@/components/WihComponents/input/datetime/WihTimeInput";


const options : Array<WihOption<PresenceType>> = [
    {value: "Unknown", displayTextLabel: Labels.presenceType.unknown},
    {value: "Late", displayTextLabel: Labels.presenceType.late},
    {value: "NotPresent", displayTextLabel: Labels.presenceType.notPresent}
];

function RepeatedEventView({response} : WihApiFocusComponentParams<RepeatedEventModel>) {
    const {t} = useTranslation();
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();

    const [event, setEvent] = useState<RepeatedEvent>(new RepeatedEvent());
    useEffect(() => {
        setEvent(new RepeatedEvent(response));
    }, [response]);

    const updateEvent = (update: Partial<RepeatedEvent>) => {
        setEvent((prev) => ({...prev, ...update}));
    }

    const onResponse = useOnResponse();
    const callWihApi = useWihApi<RepeatedEventDto>({
        endpoint: Endpoints.repeatedEvent.withId(id),
        method: "PATCH"
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => {
        if (!event) return;
        const body: RepeatedEventDto = {
            Title: event.Title!,
            FirstOccurrence: formatDate(event.FirstOccurrence!),
            LastOccurrence: event.LastOccurrence ? formatDate(event.LastOccurrence) : null,
            StartTime: formatTime(event.StartTime!),
            EndTime: formatTime(event.EndTime!),
            PresenceType: event.PresenceType!,
            DinnerTime: event.DinnerTime ? formatTime(event.DinnerTime) : null
        }
        callWihApi(body).then(onResponse);
    };

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
        <EventEditLayout event={event} onCancel={onCancel} onUpdate={onUpdate}>
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
                <WihPicker
                    value={event.PresenceType}
                    options={options}
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

export default function () {
    const {id} = useLocalSearchParams<{ id: string }>();
    return <WihApiFocus Component={RepeatedEventView} endpoint={Endpoints.repeatedEvent.withId(id)} method="GET" />
}