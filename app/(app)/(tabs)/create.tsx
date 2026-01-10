import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {ScrollView, StyleSheet} from "react-native";
import {WihTextInput} from "@/components/WihComponents/input/WihTextInput";
import React, {useState} from "react";
import WihIconRow from "@/components/WihComponents/icon/WihIconRow";
import {WihDateInput} from "@/components/WihComponents/input/datetime/WihDateInput";
import {WihCheckboxGroup} from "@/components/WihComponents/input/WihCheckboxGroup";
import {WihTimeInput} from "@/components/WihComponents/input/datetime/WihTimeInput";
import {WihPicker} from "@/components/WihComponents/input/WihPicker";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import useWihApi from "@/hooks/useWihApi";
import {EventGroupDto, EventGroupModel} from "@/constants/WihTypes/Event/EventGroup";
import {Endpoints} from "@/constants/endpoints";
import {presenceTypeOptions, weekDaysOptions} from "@/constants/ConstantOptions";
import useWihResponseToast from "@/components/pages/EventEdit/useWihResponseToast";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import Toast from "react-native-root-toast";
import useWihValidation from "@/hooks/useWihValidation";

interface NewEventGroup {
    title?: string;
    startDate?: Date;
    endDate?: Date | null;
    startTime?: Date;
    endTime?: Date | null;
    weekDays?: number[];
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
}

const Create = () => {
    const {t} = useTranslation();
    const router = useRouter();

    const { handleValidationChange, hasAnyValidationError } = useWihValidation();
    const [newEvent, setNewEvent] = useState<NewEventGroup>({});
    const updateToast = useWihResponseToast(Labels.toast.success.eventCreated, Labels.toast.error.eventCreated);
    const callApi = useWihApi<EventGroupDto, EventGroupModel>({
        endpoint: Endpoints.eventGroup.url,
        method: "POST"
    });

    const createEvent = () => {
        if(hasAnyValidationError()){
            Toast.show(t(Labels.toast.error.fixValidationError), {
                duration: Toast.durations.SHORT,
            });
            return;
        }

        const createdEvent : EventGroupDto = {
            title: newEvent.title,
            startDate: newEvent.startDate && formatDate(newEvent.startDate),
            endDate: newEvent.endDate && formatDate(newEvent.endDate),
            startTime: newEvent.startTime && formatTime(newEvent.startTime),
            endTime: newEvent.endTime && formatTime(newEvent.endTime),
            weekDays: newEvent.weekDays,
            presenceType: newEvent.presenceType,
            dinnerTime: newEvent.dinnerTime && formatTime(newEvent.dinnerTime)
        }

        callApi(createdEvent)
            .then(r => {
                updateToast(r);
                if(typeof r !== "string" && r.isValid()) {
                    setNewEvent({});
                    router.replace(`/(app)/event/view/${r.data!.id}`);
                }
            });
    }

    const updateEvent = (update: Partial<NewEventGroup>) => {
        setNewEvent(prev => ({...prev, ...update}));
    }

    const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
        updateEvent({presenceType: presenceType});
        if (presenceType !== "Late") {
            updateEvent({dinnerTime: null});
        }
    }

    return (
        <WihView style={{flex: 1}}>
            <ScrollView style={{height: "100%"}}>
                <WihView style={styles.mainContainer}>
                    <WihTitle>{t(Labels.titles.eventCreator)}</WihTitle>
                    <WihText style={styles.description}>{t(Labels.descriptions.eventCreator)}</WihText>

                    <WihTextInput
                        value={newEvent.title}
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
                            <WihDateInput
                                value={newEvent.startDate}
                                name="startDate"
                                onChange={d => updateEvent({startDate: d})}
                                validate={date => !!date}
                                validationErrorMessage={Labels.errors.validation.startDate}
                                onValidationChange={handleValidationChange}
                            />
                        </WihView>
                        <WihView style={styles.container}>
                            <WihText style={styles.labels}>{t(Labels.labels.endDate)}: </WihText>
                            <WihDateInput
                                value={newEvent.endDate}
                                name="endDate"
                                onChange={d => updateEvent({endDate: d})}
                                validate={date => !date || !newEvent.startDate || date > newEvent.startDate}
                                validationErrorMessage={Labels.errors.validation.endDate}
                                onValidationChange={handleValidationChange}
                            />
                        </WihView>
                    </WihIconRow>

                    <WihCheckboxGroup
                        name="weekDays"
                        options={weekDaysOptions}
                        values={newEvent.weekDays}
                        onChange={w => updateEvent({weekDays: w})}
                        direction="row"
                        validate={values => values.length > 0}
                        validationErrorMessage={Labels.errors.validation.weekdays}
                        onValidationChange={handleValidationChange}
                    />

                    <WihIconRow name="timeline" flexDirection="column">
                        <WihView style={styles.container}>
                            <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                            <WihTimeInput
                                value={newEvent.startTime}
                                name="startTime"
                                onChange={st => updateEvent({startTime: st})}
                                validate={time => !!time}
                                validationErrorMessage={Labels.errors.validation.startTime}
                                onValidationChange={handleValidationChange}
                            />
                        </WihView>
                        <WihView style={styles.container}>
                            <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                            <WihTimeInput
                                value={newEvent.endTime}
                                name="endTime"
                                onChange={et => updateEvent({endTime: et})}
                                validate={time => !time || !newEvent.startTime || time > newEvent.startTime}
                                validationErrorMessage={Labels.errors.validation.endTime}
                                onValidationChange={handleValidationChange}
                            />
                        </WihView>
                    </WihIconRow>

                    <WihIconRow name="home" flexDirection="row">
                        <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                        <WihPicker
                            value={newEvent.presenceType}
                            name="presenceType"
                            options={presenceTypeOptions}
                            onChange={onPresenceTypeChange}
                            validate={t => t !== undefined}
                            onValidationChange={handleValidationChange}
                        />
                    </WihIconRow>

                    <WihIconRow name="schedule" flexDirection="row">
                        <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                        <WihTimeInput
                            value={newEvent.dinnerTime}
                            name="dinnerTime"
                            disabled={newEvent.presenceType !== "Late"}
                            onChange={d => updateEvent({dinnerTime: d})}
                            validationErrorMessage={newEvent.presenceType === "Late"
                                ? Labels.errors.validation.presenceType.late
                                : Labels.errors.validation.presenceType.other}
                            validate={date => newEvent.presenceType === "Late" ? !!date : !date }
                            onValidationChange={handleValidationChange}
                        />
                    </WihIconRow>

                    <WihButton style={styles.buttons} onPress={createEvent}>
                        {t(Labels.actions.create)}
                    </WihButton>
                </WihView>
            </ScrollView>
        </WihView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
        marginTop: 20
    },
    description: {
        marginBottom: 20,
    },
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    labels: {
        fontWeight: "bold",
        paddingRight: 10,
    },
    buttons: {
        width: 160,
        marginTop: 10,
        alignSelf: "center"
    }
});

export default Create;