import {useLocalSearchParams, useRouter} from "expo-router";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import {Endpoints} from "@/constants/endpoints";
import {dateStringToDate, formatDate, formatTime} from "@/helper/datetimehelper";
import React, {useCallback, useState} from "react";
import {StyleSheet} from "react-native";
import {EventInstance, EventInstanceDto, EventInstanceModel} from "@/constants/WihTypes/Event/EventInstance";
import {useTranslation} from "react-i18next";
import {useWihValidation} from "@/hooks/useWihValidation";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import Labels from "@/constants/locales/Labels";
import useWihResponseToast from "@/components/pages/EventEdit/useWihResponseToast";
import useWihApi from "@/hooks/useWihApi";
import Toast from "react-native-root-toast";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihTextButton} from "@/components/WihComponents/input/WihButton";
import {WihTextInput} from "@/components/WihComponents/input/WihTextInput";
import WihView from "@/components/WihComponents/view/WihView";
import {WihDateInput} from "@/components/WihComponents/input/datetime/WihDateInput";
import {WihTimeInput} from "@/components/WihComponents/input/datetime/WihTimeInput";
import {WihPicker} from "@/components/WihComponents/input/WihPicker";
import {presenceTypeOptions} from "@/constants/ConstantOptions";

interface EventInstanceUpdate {
    title?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date | null;
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
}

export default function () {
    const { id, date } = useLocalSearchParams<{ id: string, date?: string }>();
    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceEdit} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
}

function EventInstanceEdit({response} : WihApiFocusComponentParams<EventInstanceModel>) {
    const {t} = useTranslation();
    const router = useRouter();

    const [eventUpdate, setEventUpdate] = useState<EventInstanceUpdate>({});
    const event = new EventInstance(response);

    const updateEvent = (update: Partial<EventInstanceUpdate>) => {
        setEventUpdate(prev => ({...prev, ...update}));
    }

    const validator = useWihValidation(EventInstanceEdit.name);
    const updateToast = useWihResponseToast(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<EventInstanceDto, EventInstanceModel>({
        endpoint: Endpoints.eventGroup.instance.withDate(response.id, event.date),
        method: "PATCH"
    });

    const onCancel = useCallback(() => {
        router.back();
    }, [response.id]);

    const onUpdate = () => {
        validator.showErrors();
        if(validator.hasAnyValidationError()){
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
                validator={validator}
            />

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={eventUpdate.date ?? event.date}
                                  name="date"
                                  onChange={d => updateEvent({date: d})}
                                  validate={d => !!d}
                                  validationErrorMessage={Labels.errors.validation.date}
                                  validator={validator}
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
                                  validator={validator}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={eventUpdate.endTime === undefined ? event.endTime : eventUpdate.endTime}
                                  name="endTime"
                                  onChange={et => updateEvent({endTime: et})}
                                  validate={time => !time || !eventUpdate.startTime || time > eventUpdate.startTime}
                                  validationErrorMessage={Labels.errors.validation.endTime}
                                  validator={validator}
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
                    validator={validator}
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
                    validator={validator}
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