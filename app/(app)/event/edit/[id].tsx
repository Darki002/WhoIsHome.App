import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {dateStringToDate, formatDate, formatTime} from "@/helper/datetimehelper";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {Endpoints} from "@/constants/endpoints";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import useWihResponseToast from "@/components/pages/EventEdit/useWihResponseToast";
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
import {WihTextButton} from "@/components/WihComponents/input/WihButton";
import {presenceTypeOptions, weekDaysOptions} from "@/constants/ConstantOptions";
import useWihValidation from "@/hooks/useWihValidation";
import Toast from "react-native-root-toast";

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

function EventGroupEdit({response} : WihApiFocusComponentParams<EventGroupModel>) {
    const {t} = useTranslation();
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id: string }>();

    const [eventUpdate, setEventUpdate] = useState<EventGroupUpdate>({});
    const event = new EventGroup(response);

    const updateEvent = (update: Partial<EventGroupUpdate>) => {
        setEventUpdate(prev => ({...prev, ...update}));
    }

    const { handleValidationChange, hasAnyValidationError } = useWihValidation();
    const updateToast = useWihResponseToast(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<EventGroupDto, EventGroupModel>({
        endpoint: Endpoints.eventGroup.withId(id),
        method: "PATCH"
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => {
        if(hasAnyValidationError()){
            Toast.show(t(Labels.toast.error.fixValidationError), {
                duration: Toast.durations.SHORT,
            });
            return;
        }

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
                name="title"
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => updateEvent({title: t})}
                validate={t => t !== undefined && t.length > 0 && t.length <= 50}
                validationErrorMessage={Labels.errors.validation.title}
                onValidationChange={handleValidationChange}
            />

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={eventUpdate.startDate ?? event.startDate}
                                  name="startDate"
                                  onChange={d => updateEvent({startDate: d})}
                                  validate={date => !!date}
                                  validationErrorMessage={Labels.errors.validation.startDate}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                    <WihDateInput value={eventUpdate.endDate === undefined ? event.endDate : eventUpdate.endDate}
                                  name="endDate"
                                  onChange={d => updateEvent({endDate: d})}
                                  validate={date => !date || !eventUpdate.startDate || date > eventUpdate.startDate}
                                  validationErrorMessage={Labels.errors.validation.endDate}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
                <WihCheckboxGroup name="weekDays"
                                  options={weekDaysOptions}
                                  values={eventUpdate.weekDays ?? event.weekDays}
                                  onChange={w => updateEvent({weekDays: w})}
                                  direction="row"
                                  validate={values => values.length > 0}
                                  validationErrorMessage={Labels.errors.validation.weekdays}
                                  onValidationChange={handleValidationChange}
                />
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.startTime ?? event.startTime}
                                  name="startTime"
                                  onChange={st => updateEvent({startTime: st})}
                                  validate={time => !!time}
                                  validationErrorMessage={Labels.errors.validation.startTime}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.endTime === undefined ? event.endTime : eventUpdate.endTime}
                                  name="endTime"
                                  onChange={et => updateEvent({endTime: et})}
                                  validate={time => !time || !eventUpdate.startTime || time > eventUpdate.startTime}
                                  validationErrorMessage={Labels.errors.validation.endTime}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihPicker
                    name="presenceType"
                    value={eventUpdate.presenceType ?? event.presenceType}
                    options={presenceTypeOptions}
                    onChange={onPresenceTypeChange}
                    validate={t => t !== undefined}
                    onValidationChange={handleValidationChange}
                />
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={eventUpdate.dinnerTime === undefined ? event.dinnerTime : eventUpdate.dinnerTime}
                    name="dinnerTime"
                    disabled={event.presenceType !== "Late"}
                    onChange={d => updateEvent({dinnerTime: d})}
                    validationErrorMessage={eventUpdate.presenceType === "Late"
                        ? Labels.errors.validation.presenceType.late
                        : Labels.errors.validation.presenceType.other}
                    validate={date => eventUpdate.presenceType === "Late" ? !!date : !date }
                    onValidationChange={handleValidationChange}
                />
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

    const { handleValidationChange, hasAnyValidationError } = useWihValidation();
    const updateToast = useWihResponseToast(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<EventInstanceDto, EventInstanceModel>({
        endpoint: Endpoints.eventGroup.instance.withDate(id, event.date),
        method: "PATCH"
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [id]);

    const onUpdate = () => {
        if(hasAnyValidationError()){
            Toast.show(t(Labels.toast.error.fixValidationError), {
                duration: Toast.durations.SHORT,
            });
            return;
        }

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
            <WihIconRow name="info" flexDirection="column">
                <WihText>{t(Labels.message.editInstance)}</WihText>
                <WihTextButton onPress={() => router.setParams({date: undefined})}>
                    {t(Labels.actions.editGroup)}
                </WihTextButton>
            </WihIconRow>

            <WihTextInput
                name="title"
                value={eventUpdate.title ?? event.title}
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => updateEvent({title: t})}
                validate={t => t !== undefined && t.length > 0 && t.length <= 50}
                validationErrorMessage={Labels.errors.validation.title}
                onValidationChange={handleValidationChange}
            />

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={eventUpdate.date ?? event.date}
                                  name="date"
                                  onChange={d => updateEvent({date: d})}
                                  validate={d => !!d}
                                  validationErrorMessage={Labels.errors.validation.date}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.startTime ?? event.startTime}
                                  name="startTime"
                                  onChange={st => updateEvent({startTime: st})}
                                  validate={time => !!time}
                                  validationErrorMessage={Labels.errors.validation.startTime}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.endTime === undefined ? event.endTime : eventUpdate.endTime}
                                  name="endTime"
                                  onChange={et => updateEvent({endTime: et})}
                                  validate={time => !time || !eventUpdate.startTime || time > eventUpdate.startTime}
                                  validationErrorMessage={Labels.errors.validation.endTime}
                                  onValidationChange={handleValidationChange}
                    />
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihPicker
                    name="presenceType"
                    value={eventUpdate.presenceType ?? event.presenceType}
                    options={presenceTypeOptions}
                    onChange={onPresenceTypeChange}
                    validate={t => t !== undefined}
                    onValidationChange={handleValidationChange}
                />
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={eventUpdate.dinnerTime === undefined ? event.dinnerTime : eventUpdate.dinnerTime}
                    name="dinnerTime"
                    disabled={event.presenceType !== "Late"}
                    onChange={d => updateEvent({dinnerTime: d})}
                    validationErrorMessage={eventUpdate.presenceType === "Late"
                        ? Labels.errors.validation.presenceType.late
                        : Labels.errors.validation.presenceType.other}
                    validate={date => eventUpdate.presenceType === "Late" ? !!date : !date }
                    onValidationChange={handleValidationChange}
                />
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