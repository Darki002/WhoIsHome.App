import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {formatDate, formatTime} from "@/helper/datetimehelper";
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
import {EventGroup, EventGroupModel, EventGroupUpdate} from "@/constants/WihTypes/Event/EventGroup";
import {WihCheckboxGroup} from "@/components/WihComponents/input/WihCheckboxGroup";
import {presenceTypeOptions, weekDaysOptions} from "@/constants/ConstantOptions";
import {useWihValidation} from "@/hooks/useWihValidation";
import Toast from "react-native-root-toast";
import {DtoPatch, PathDocument} from "@/constants/WihTypes/DtoPatch";

function EventGroupEdit({response} : WihApiFocusComponentParams<EventGroupModel>) {
    const {t} = useTranslation();
    const router = useRouter();

    const [update] = useState(new EventGroupUpdate());
    const event = new EventGroup(response);

    const validator = useWihValidation(EventGroupEdit.name);
    const updateToast = useWihResponseToast(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<PathDocument, EventGroupModel>({
        endpoint: Endpoints.eventGroup.withId(response.id),
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

        callWihApi(update.getUpdates()).then(updateToast);
    };

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        update.updatePresenceType(presenceType);
        if (presenceType !== "Late") {
            update.updateDinnerTime(null);
        }
    }

    const isPresencePickerDisabled = () => {
        const presenceType = update.presenceType && event.presenceType;
        return presenceType !== PresenceType.Late
    }

    return (
        <EventEditLayout title={event.title} userId={event.userId} onCancel={onCancel} onUpdate={onUpdate}>
            <WihTextInput
                value={update.title ?? event.title}
                name="title"
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => update.updateTitle(t)}
                validate={t => t !== undefined && t.length > 0 && t.length <= 50}
                validationErrorMessage={Labels.errors.validation.title}
                validator={validator}
            />

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={update.startDate ?? event.startDate}
                                  name="startDate"
                                  onChange={d => update.updateStartDate(d)}
                                  validate={date => !!date}
                                  validationErrorMessage={Labels.errors.validation.startDate}
                                  validator={validator}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                    <WihDateInput value={update.endDate === undefined ? event.endDate : update.endDate}
                                  name="endDate"
                                  onChange={d => update.updateEndDate(d)}
                                  validate={date => !date || !update.startDate || date > update.startDate}
                                  validationErrorMessage={Labels.errors.validation.endDate}
                                  validator={validator}
                    />
                </WihView>
            </WihIconRow>

            <WihCheckboxGroup name="weekDays"
                              options={weekDaysOptions}
                              values={update.weekDays ?? event.weekDays}
                              onChange={w => update.updateWeekDays(w)}
                              direction="row"
                              validate={values => values.length > 0}
                              validationErrorMessage={Labels.errors.validation.weekdays}
                              validator={validator}
            />

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={update.startTime ?? event.startTime}
                                  name="startTime"
                                  onChange={st => update.updateStartTime(st)}
                                  validate={time => !!time}
                                  validationErrorMessage={Labels.errors.validation.startTime}
                                  validator={validator}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={update.endTime === undefined ? event.endTime : update.endTime}
                                  name="endTime"
                                  onChange={et => update.updateEndTime(et)}
                                  validate={time => !time || !update.startTime || time > update.startTime}
                                  validationErrorMessage={Labels.errors.validation.endTime}
                                  validator={validator}
                    />
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihPicker
                    name="presenceType"
                    value={update.presenceType ?? event.presenceType}
                    options={presenceTypeOptions}
                    onChange={onPresenceTypeChange}
                    validate={t => t !== undefined}
                    validator={validator}
                />
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={update.dinnerTime === undefined ? event.dinnerTime : update.dinnerTime}
                    name="dinnerTime"
                    disabled={isPresencePickerDisabled()}
                    onChange={d => update.updateDinnerTime(d)}
                    validationErrorMessage={update.presenceType === PresenceType.Late
                        ? Labels.errors.validation.presenceType.late
                        : Labels.errors.validation.presenceType.other}
                    validate={date => update.presenceType === PresenceType.Late ? !!date : !date }
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

export default function () {
    const { id } = useLocalSearchParams<{ id: string, date?: string }>();
    return <WihApiFocus Component={EventGroupEdit} endpoint={Endpoints.eventGroup.withId(id)} method="GET" />
}