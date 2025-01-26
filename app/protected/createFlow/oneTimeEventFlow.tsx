import {WihFlow, WihFlowComponentProps, WihFlowStep} from "@/components/framework/wihFlow/wihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import React, {useCallback} from "react";
import WihView from "@/components/WihView";
import {WihDateInput} from "@/components/input/DateTime/WihDateInput";
import {formatDate, formatTime, timeDisplayString} from "@/helper/datetimehelper";
import TitleStep from "@/components/pages/CreateFlow/TitleStep";
import DinnerTimeStep from "@/components/pages/CreateFlow/DinnerTimeStep";
import {DateStepBase, DateValidationBase} from "@/components/pages/CreateFlow/DateStepBase";
import useCreateFlowCallbacks from "@/hooks/useCreateFlowCallbacks";
import {OneTimeEvent, OneTimeEventDto} from "@/constants/WihTypes/Event/OneTimeEvent";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import WihIconRow from "@/components/WihIconRow";
import {StyleSheet} from "react-native";

const defaultOneTimeEvent: OneTimeEvent = {
    Title: "",
    Date: new Date(),
    StartTime: undefined,
    EndTime: undefined,
    PresenceType: "Unknown",
    DinnerTime: null,
};

export default function OneTimeEventFlow() {
    const [callWihApi, onCancel] = useCreateFlowCallbacks(Endpoints.oneTimeEvent.url);

    const onFinish = useCallback((state: OneTimeEvent) => {
        const body: OneTimeEventDto = {
            Title: state.Title!,
            Date: formatDate(state.Date!),
            StartTime: formatTime(state.StartTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body);
    }, [callWihApi]);

    return <WihFlow<OneTimeEvent>
        initValue={defaultOneTimeEvent}
        onFinish={onFinish}
        onCancel={onCancel}
        steps={components}/>
}

const dateStep: WihFlowStep<OneTimeEvent> = {
    validate: (state: OneTimeEvent) => state.Date !== undefined && DateValidationBase(state),
    component: ({state, setState, isInvalid}: WihFlowComponentProps<OneTimeEvent>) => {
        const {t} = useTranslation();
        const theme = useWihTheme();
        return (
            <DateStepBase state={state} setState={setState} isInvalid={isInvalid}>
                <WihView style={{flexDirection: "row"}}>
                    <WihText>{t(Labels.labels.date)}:</WihText>
                    <WihDateInput
                        value={state.Date}
                        onChange={(date) => setState({Date: date})}/>
                </WihView>
                {isInvalid && !state.Date && <WihText style={{color: theme.error}}>{t(Labels.errors.validation.date)}</WihText>}
            </DateStepBase>
        );
    }
}

const summaryStep: WihFlowStep<OneTimeEvent> = {
    validate: (_: OneTimeEvent) => true,
    component: ({state}: WihFlowComponentProps<OneTimeEvent>) => {
        const {t} = useTranslation();
        return (
            <WihView style={{alignItems: "center", justifyContent: "center"}}>
                <WihTitle>{state.Title}</WihTitle>

                <WihIconRow name="date-range" flexDirection="row">
                    <WihText style={styles.labels}>{t(Labels.labels.date)}: </WihText>
                    <WihText>{state.Date?.toLocaleDateString() ?? "N/A"}</WihText>
                </WihIconRow>

                <WihIconRow name="timeline" flexDirection="column">
                    <WihView style={styles.container}>
                        <WihText style={styles.labels}>{t(Labels.labels.startTime)}: </WihText>
                        <WihText>{state.StartTime ? timeDisplayString(state.StartTime) : "N/A"}</WihText>
                    </WihView>
                    <WihView style={styles.container}>
                        <WihText style={styles.labels}>{t(Labels.labels.endTime)}: </WihText>
                        <WihText>{state.EndTime ? timeDisplayString(state.EndTime) : "N/A"}</WihText>
                    </WihView>
                </WihIconRow>

                <WihIconRow name="home" flexDirection="row">
                    <WihText style={styles.labels}>{t(Labels.labels.presenceType)}: </WihText>
                    <WihText>{state.PresenceType ?? "Missing"}</WihText>
                </WihIconRow>

                <WihIconRow name="schedule" flexDirection="row">
                    <WihText style={styles.labels}>{t(Labels.labels.dinnerTime)}: </WihText>
                    <WihText>{state.DinnerTime ? timeDisplayString(state.DinnerTime) : "N/A"}</WihText>
                </WihIconRow>
            </WihView>
        )
    }
}

const components: Array<WihFlowStep<OneTimeEvent>> = [
    TitleStep,
    dateStep,
    DinnerTimeStep,
    summaryStep
];

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row"
    },
    labels: {
        fontWeight: "bold"
    }
});