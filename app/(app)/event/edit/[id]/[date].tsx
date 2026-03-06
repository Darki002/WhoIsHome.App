import {useLocalSearchParams, useRouter} from "expo-router";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import {Endpoints} from "@/constants/endpoints";
import {dateStringToDate} from "@/helper/datetimehelper";
import React, {useCallback, useState} from "react";
import {StyleSheet} from "react-native";
import {EventInstance, EventInstanceModel, EventInstanceUpdate} from "@/constants/WihTypes/Event/EventInstance";
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
import WihView from "@/components/WihComponents/view/WihView";
import {WihDateInput} from "@/components/WihComponents/input/datetime/WihDateInput";
import {WihTimeInput} from "@/components/WihComponents/input/datetime/WihTimeInput";
import {WihPicker} from "@/components/WihComponents/input/WihPicker";
import {presenceTypeOptions} from "@/constants/ConstantOptions";
import {PathDocument} from "@/constants/WihTypes/DtoPatch";

export default function () {
    const { id, date } = useLocalSearchParams<{ id: string, date: string }>();
    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceEdit} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
}

function EventInstanceEdit({response} : WihApiFocusComponentParams<EventInstanceModel>) {
    const {t} = useTranslation();
    const router = useRouter();

    const [update] = useState(new EventInstanceUpdate());
    const event = new EventInstance(response);

    const validator = useWihValidation(EventInstanceEdit.name);
    const updateToast = useWihResponseToast(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<PathDocument, EventInstanceModel>({
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

        callWihApi(update.getUpdates()).then(updateToast);
    };

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        update.updatePresenceType(presenceType);
        if (presenceType !== "Late") {
            update.updateDinnerTime(null);
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

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={update.Date ?? event.date}
                                  name="date"
                                  onChange={d => update.updateDate(d)}
                                  validate={d => !!d}
                                  validationErrorMessage={Labels.errors.validation.date}
                                  validator={validator}
                    />
                </WihView>
            </WihIconRow>

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
                                  onChange={et => update.updateEndTime(update.endTime)}
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
                    disabled={event.presenceType !== "Late"}
                    onChange={d => update.updateDinnerTime(d)}
                    validationErrorMessage={update.presenceType === "Late"
                        ? Labels.errors.validation.presenceType.late
                        : Labels.errors.validation.presenceType.other}
                    validate={date => update.presenceType === "Late" ? !!date : !date }
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