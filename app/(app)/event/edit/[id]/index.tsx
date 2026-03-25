import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback} from "react";
import EventEditLayout from "@/components/pages/EventEdit/EventEditLayout";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {Endpoints} from "@/constants/endpoints";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import useWihResponseHandler from "@/components/pages/EventEdit/useWihResponseHandler";
import {WihTextInput} from "@/components/WihComponents/input/WihTextInput";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {StyleSheet} from "react-native";
import {WihPicker} from "@/components/WihComponents/input/WihPicker";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import useWihApi from "@/hooks/useWihApi";
import {WihDateInput} from "@/components/WihComponents/input/datetime/WihDateInput";
import {WihTimeInput} from "@/components/WihComponents/input/datetime/WihTimeInput";
import {EventGroup, EventGroupDto, EventGroupModel} from "@/constants/WihTypes/Event/EventGroup";
import {WihCheckboxGroup} from "@/components/WihComponents/input/WihCheckboxGroup";
import {presenceTypeOptions, weekDaysOptions} from "@/constants/ConstantOptions";
import {useWihValidation} from "@/hooks/useWihValidation";
import Toast from "react-native-root-toast";
import {PathDocument} from "@/constants/WihTypes/DtoPatch";
import {WihContentTypes} from "@/helper/fetch/WihContentTypes";
import {usePatchReducer} from "@/hooks/usePatchReducer";
import {dateStringToDate, formatDate, formatTime, timeStringToDate} from "@/helper/datetimehelper";

function EventGroupEdit({response} : WihApiFocusComponentParams<EventGroupModel>) {
    const {t} = useTranslation();
    const router = useRouter();

    const {state, dispatch} = usePatchReducer<EventGroupDto>();
    const event = new EventGroup(response);

    const validator = useWihValidation(EventGroupEdit.name);
    const handleResponse = useWihResponseHandler(Labels.toast.success.updateEvent, Labels.toast.error.updateEvent);
    const callWihApi = useWihApi<PathDocument, EventGroupModel>({
        endpoint: Endpoints.eventGroup.withId(response.id),
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
            <WihTextInput
                value={state.data.title ?? event.title}
                name="title"
                placeholder={t(Labels.placeholders.title)}
                onChangeText={t => dispatch({title: t})}
                validate={t => t !== undefined && t.length > 0 && t.length <= 50}
                validationErrorMessage={Labels.errors.validation.title}
                validator={validator}
            />

            <WihIconRow name="date-range" flexDirection="column">
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.startDate)}: </WihText>
                    <WihDateInput value={dateStringToDate(state.data.startDate) ?? event.startDate}
                                  name="startDate"
                                  onChange={d => dispatch({startDate: d && formatDate(d)})}
                                  validate={date => !!date}
                                  validationErrorMessage={Labels.errors.validation.startDate}
                                  validator={validator}
                    />
                </WihView>
                <WihView style={styles.container}>
                    <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                    <WihDateInput value={state.data.endDate === undefined ? event.endDate : dateStringToDate(state.data.endDate)}
                                  name="endDate"
                                  onChange={d => dispatch({endDate: d && formatDate(d)})}
                                  validate={date => !date || !state.data.startDate || date > dateStringToDate(state.data.startDate)!}
                                  validationErrorMessage={Labels.errors.validation.endDate}
                                  validator={validator}
                    />
                </WihView>
            </WihIconRow>

            <WihCheckboxGroup name="weekDays"
                              options={weekDaysOptions}
                              values={state.data.weekDays ?? event.weekDays}
                              onChange={w => dispatch({weekDays: w})}
                              direction="row"
                              validate={values => values.length > 0}
                              validationErrorMessage={Labels.errors.validation.weekdays}
                              validator={validator}
            />

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

export default function () {
    const { id } = useLocalSearchParams<{ id: string, date?: string }>();
    return <WihApiFocus Component={EventGroupEdit} endpoint={Endpoints.eventGroup.withId(id)} method="GET" />
}