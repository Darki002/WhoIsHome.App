import {useLocalSearchParams, useRouter} from "expo-router";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import {Endpoints} from "@/constants/endpoints";
import {dateStringToDate, formatDate, formatTime, timeStringToDate} from "@/helper/datetimehelper";
import React, {useCallback} from "react";
import {StyleSheet} from "react-native";
import {
    EventInstance,
    EventInstanceDto,
    EventInstanceModel,
} from "@/constants/WihTypes/Event/EventInstance";
import {useTranslation} from "react-i18next";
import {useWihValidation} from "@/hooks/useWihValidation";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import Labels from "@/constants/locales/Labels";
import useWihResponseHandler from "@/components/pages/EventEdit/useWihResponseHandler";
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
import {usePatchReducer} from "@/hooks/usePatchReducer";
import {WihContentTypes} from "@/helper/fetch/WihContentTypes";

export default function () {
    const { id, date } = useLocalSearchParams<{ id: string, date: string }>();
    const d = dateStringToDate(date)!;
    return <WihApiFocus Component={EventInstanceEdit} endpoint={Endpoints.eventGroup.instance.withDate(id, d)} method="GET" />
}

function EventInstanceEdit({response} : WihApiFocusComponentParams<EventInstanceModel>) {
    const {t} = useTranslation();
    const router = useRouter();

    const {state, dispatch} = usePatchReducer<EventInstanceDto>();
    const event = new EventInstance(response);

    const validator = useWihValidation(EventInstanceEdit.name);
    const handleResponse = useWihResponseHandler(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<PathDocument, EventInstanceModel>({
        endpoint: Endpoints.eventGroup.instance.withDate(response.eventGroupId, event.date),
        method: "PATCH",
        contentType: WihContentTypes.JSONPatch
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

        callWihApi(state.updates).then(r => {
            handleResponse(r);
            router.back();
        });
    };

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        dispatch({presenceType: presenceType});
        if (presenceType !== "Late") {
            dispatch({dinnerTime: null});
        }
    }

    const validatePresenceType = (date?: Date | null) =>{
        const presenceType = state.data.presenceType ? state.data.presenceType : event.presenceType;
        return presenceType === PresenceType.Late ? !!date : !date;
    }

    const isPresencePickerDisabled = () => {
        const presenceType = state.data.presenceType ? state.data.presenceType : event.presenceType;
        return presenceType !== PresenceType.Late
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
                    <WihText style={styles.labels}>{t(Labels.labels.date)}: </WihText>
                    <WihDateInput value={dateStringToDate(state.data.date) ?? event.date}
                                  name="date"
                                  onChange={d => dispatch({date: d && formatDate(d)})}
                                  validate={d => !!d}
                                  validationErrorMessage={Labels.errors.validation.date}
                                  validator={validator}
                    />
                </WihView>
            </WihIconRow>

            <WihIconRow name="timeline" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                    <WihTimeInput value={timeStringToDate(state.data.startTime) ?? event.startTime}
                                  name="startTime"
                                  onChange={st => dispatch({startTime: st && formatTime(st)})}
                                  validate={time => !!time}
                                  validationErrorMessage={Labels.errors.validation.startTime}
                                  validator={validator}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                    <WihTimeInput value={state.data.endTime === undefined ? event.endTime : timeStringToDate(state.data.endTime)}
                                  name="endTime"
                                  onChange={et => dispatch({endTime: et && formatTime(et)})}
                                  validate={time => !time || !state.data.startTime || time > timeStringToDate(state.data.startTime)!}
                                  validationErrorMessage={Labels.errors.validation.endTime}
                                  validator={validator}
                    />
                </WihView>
            </WihIconRow>

            <WihIconRow name="home" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                <WihPicker
                    name="presenceType"
                    value={state.data.presenceType ?? event.presenceType}
                    options={presenceTypeOptions}
                    onChange={onPresenceTypeChange}
                    validate={t => t !== undefined}
                    validator={validator}
                />
            </WihIconRow>

            <WihIconRow name="schedule" flexDirection="row">
                <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                <WihTimeInput
                    value={state.data.dinnerTime === undefined ? event.dinnerTime : timeStringToDate(state.data.dinnerTime)}
                    name="dinnerTime"
                    disabled={isPresencePickerDisabled()}
                    onChange={d => dispatch({dinnerTime: d && formatTime(d)})}
                    validationErrorMessage={state.data.presenceType === PresenceType.Late
                        ? Labels.errors.validation.presenceType.late
                        : Labels.errors.validation.presenceType.other}
                    validate={validatePresenceType}
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