import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {dateStringToDate, formatDate, formatTime} from "@/helper/datetimehelper";
import {WihOption} from "@/components/WihComponents/input/WihRadioButton";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {Endpoints} from "@/constants/endpoints";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import useUpdateToast from "@/components/pages/EventEdit/useUpdateToast";
import {WihTextInput} from "@/components/WihComponents/input/WihTextInput";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {StyleSheet} from "react-native";
import {WihPicker} from "@/components/WihComponents/input/WihPicker";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";
import {WihDateInput} from "@/components/WihComponents/input/datetime/WihDateInput";
import {WihTimeInput} from "@/components/WihComponents/input/datetime/WihTimeInput";
import {EventGroup, EventGroupModel, EventGroupDto} from "@/constants/WihTypes/Event/EventGroup";
import {EventInstance, EventInstanceDto, EventInstanceModel} from "@/constants/WihTypes/Event/EventInstance";
import {WihCheckboxGroup} from "@/components/WihComponents/input/WihCheckboxGroup";

interface EventGroupUpdate {
    title?: string;
    startDate?: Date;
    endDate?: Date | null;
    startTime?: Date;
    endTime?: Date | null;
    weekDays?: number[];
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
}

interface EventInstanceUpdate {
    title?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date | null;
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
}

const options : Array<WihOption<PresenceType>> = [
    {value: "Unknown", displayTextLabel: Labels.presenceType.unknown},
    {value: "Late", displayTextLabel: Labels.presenceType.late},
    {value: "NotPresent", displayTextLabel: Labels.presenceType.notPresent}
];

const weekDaysOptions: Array<WihOption<number>> = [
    {value: 1, displayTextLabel: Labels.weekdays.shortByNumber[1]},
    {value: 2, displayTextLabel: Labels.weekdays.shortByNumber[2]},
    {value: 3, displayTextLabel: Labels.weekdays.shortByNumber[3]},
    {value: 4, displayTextLabel: Labels.weekdays.shortByNumber[4]},
    {value: 5, displayTextLabel: Labels.weekdays.shortByNumber[5]},
    {value: 6, displayTextLabel: Labels.weekdays.shortByNumber[6]},
    {value: 0, displayTextLabel: Labels.weekdays.shortByNumber[0]}
]

function EventGroupEdit({response} : WihApiFocusComponentParams<EventGroupModel>) {
    const {t} = useTranslation();
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();

    const [eventUpdate, setEventUpdate] = useState<EventGroupUpdate>({});
    const event = new EventGroup(response);

    const updateEvent = (update: Partial<EventGroupUpdate>) => {
        setEventUpdate(prev => ({...prev, ...update}));
    }

    const updateToast = useUpdateToast();
    const callWihApi = useWihApi<EventGroupDto>({
        endpoint: Endpoints.eventGroup.withId(id),
        method: "PATCH"
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => {
        const update : EventGroupDto = {
            title: eventUpdate.title,
            startDate: eventUpdate.startDate && formatDate(eventUpdate.startDate),
            endDate: eventUpdate.endDate && formatDate(eventUpdate.endDate),
            startTime: eventUpdate.startTime && formatTime(eventUpdate.startTime),
            endTime: eventUpdate.endTime && formatTime(eventUpdate.endTime),
            weekDays: eventUpdate.weekDays,
            presenceType: eventUpdate.presenceType,
            dinnerTime: eventUpdate.dinnerTime && formatDate(eventUpdate.dinnerTime),
        }
        callWihApi(update).then(updateToast);
    };

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        updateEvent({presenceType: presenceType});
        if (presenceType !== "Late") {
            updateEvent({dinnerTime: null});
        }
    }

    return (
        <EventEditLayout title={event.title} userId={event.userId} onCancel={onCancel} onUpdate={onUpdate}>
            <WihTextInput
                value={eventUpdate.title ?? event.title}
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => updateEvent({title: t})}/>

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={eventUpdate.startDate ?? event.startDate}
                                  onChange={d => updateEvent({startDate: d})}/>
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                    <WihDateInput value={eventUpdate.endDate === undefined ? event.endDate : eventUpdate.endDate}
                                  onChange={d => updateEvent({endDate: d})}/>
                </WihView>
                <WihCheckboxGroup options={weekDaysOptions}
                                  values={eventUpdate.weekDays ?? event.weekDays}
                                  onChange={w => updateEvent({weekDays: w})}
                                  direction="row" />
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.startTime ?? event.startTime}
                                  onChange={st => updateEvent({startTime: st})} />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.endTime === undefined ? event.endTime : eventUpdate.endTime}
                                  onChange={et => updateEvent({endTime: et})} />
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihPicker
                    value={eventUpdate.presenceType ?? event.presenceType}
                    options={options}
                    onChange={onPresenceTypeChange}/>
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={eventUpdate.dinnerTime === undefined ? event.dinnerTime : eventUpdate.dinnerTime}
                    disabled={event.presenceType !== "Late"}
                    onChange={d => updateEvent({dinnerTime: d})}/>
            </WihIconRow>
        </EventEditLayout>
    )
}

function EventInstanceEdit({response} : WihApiFocusComponentParams<EventInstanceModel>) {
    const {t} = useTranslation();
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();

    const [eventUpdate, setEventUpdate] = useState<EventInstanceUpdate>({});
    const event = new EventInstance(response);

    const updateEvent = (update: Partial<EventInstanceUpdate>) => {
        setEventUpdate(prev => ({...prev, ...update}));
    }

    const updateToast = useUpdateToast();
    const callWihApi = useWihApi<EventInstanceDto>({
        endpoint: Endpoints.eventGroup.instance.withDate(id, event.date),
        method: "PATCH"
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => {
        const update : EventInstanceDto = {
            title: eventUpdate.title,
            date: eventUpdate.date && formatDate(eventUpdate.date),
            startTime: eventUpdate.startTime && formatTime(eventUpdate.startTime),
            endTime: eventUpdate.endTime && formatTime(eventUpdate.endTime),
            presenceType: eventUpdate.presenceType,
            dinnerTime: eventUpdate.dinnerTime && formatDate(eventUpdate.dinnerTime),
        }
        callWihApi(update).then(updateToast);
    };

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        updateEvent({presenceType: presenceType});
        if (presenceType !== "Late") {
            updateEvent({dinnerTime: null});
        }
    }

    return (
        <EventEditLayout title={event.title} userId={event.userId} onCancel={onCancel} onUpdate={onUpdate}>
            <WihTextInput
                value={eventUpdate.title ?? event.title}
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => updateEvent({title: t})}/>

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={eventUpdate.date ?? event.date}
                                  onChange={d => updateEvent({date: d})}/>
                </WihView>
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.startTime ?? event.startTime}
                                  onChange={st => updateEvent({startTime: st})} />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.endTime === undefined ? event.endTime : eventUpdate.endTime}
                                  onChange={et => updateEvent({endTime: et})} />
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihPicker
                    value={eventUpdate.presenceType ?? event.presenceType}
                    options={options}
                    onChange={onPresenceTypeChange}/>
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={eventUpdate.dinnerTime === undefined ? event.dinnerTime : eventUpdate.dinnerTime}
                    disabled={event.presenceType !== "Late"}
                    onChange={d => updateEvent({dinnerTime: d})}/>
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
    const { id, date } = useLocalSearchParams<{ id: string, date?: string }>();

    if(!date){
        return <WihApiFocus Component={EventGroupEdit} endpoint={Endpoints.eventGroup.withId(id)} method="GET" />
    }

    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceEdit} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
}