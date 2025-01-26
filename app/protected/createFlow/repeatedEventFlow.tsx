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
import {RepeatedEvent, RepeatedEventDto} from "@/constants/WihTypes/Event/RepeatedEvent";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {Endpoints} from "@/constants/endpoints";
import {StyleSheet} from "react-native";
import WihIconRow from "@/components/WihIconRow";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import WihDivider from "@/components/WihDivider";

const defaultOneTimeEvent: RepeatedEvent = {
    Title: "",
    FirstOccurrence: undefined,
    LastOccurrence: undefined,
    StartTime: undefined,
    EndTime: undefined,
    PresenceType: "Unknown",
    DinnerTime: null,
};

export default function RepeatedEventFlow() {
    const [callWihApi, onCancel] = useCreateFlowCallbacks(Endpoints.repeatedEvent.url);

    const onFinish = useCallback((state: RepeatedEvent) => {
        const body: RepeatedEventDto = {
            Title: state.Title!,
            FirstOccurrence: formatDate(state.FirstOccurrence!),
            LastOccurrence: formatDate(state.LastOccurrence!),
            StartTime: formatTime(state.StartTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body);
    }, [callWihApi]);

    return <WihFlow<RepeatedEvent> initValue={defaultOneTimeEvent} onFinish={onFinish} onCancel={onCancel}
                                   steps={components}/>
}

const dateStep: WihFlowStep<RepeatedEvent> = {
    validate: (state: RepeatedEvent) => state.FirstOccurrence !== undefined && state.LastOccurrence !== undefined && state.FirstOccurrence <= state.LastOccurrence && DateValidationBase(state),
    component: ({state, setState, isInvalid}: WihFlowComponentProps<RepeatedEvent>) => {
        const {t} = useTranslation();
        const theme = useWihTheme()
        return (
            <DateStepBase state={state} setState={setState} isInvalid={isInvalid}>
                <WihView style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                    <WihText>{t(Labels.labels.firstOccurrence)}:</WihText>
                    <WihDateInput
                        value={state.FirstOccurrence}
                        onChange={(date) => setState({FirstOccurrence: date})}/>
                </WihView>
                {isInvalid && !state.FirstOccurrence &&
                    <WihText style={{color: theme.error}}>{t(Labels.errors.validation.firstOccurrence)}</WihText>}

                <WihView style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                    <WihText>{t(Labels.labels.lastOccurrence)}:</WihText>
                    <WihDateInput
                        value={state.LastOccurrence}
                        onChange={(date) => setState({LastOccurrence: date})}/>
                </WihView>
                {isInvalid && !state.LastOccurrence &&
                    <WihText style={{color: theme.error}}>{t(Labels.errors.validation.lastOccurrence)}</WihText>}
            </DateStepBase>
        );
    }
}

const summaryStep: WihFlowStep<RepeatedEvent> = {
    validate: (_: RepeatedEvent) => true,
    component: ({state}: WihFlowComponentProps<RepeatedEvent>) => {
        const {t} = useTranslation();
        return (
            <WihView style={{alignItems: "center", justifyContent: "center"}}>
                <WihTitle style={{marginBottom: 15}}>{state.Title}</WihTitle>

                <WihIconRow name="date-range" flexDirection="column">
                    <WihView style={styles.container}>
                        <WihText style={styles.labels}>{t(Labels.labels.firstOccurrence)}: </WihText>
                        <WihText>{state.FirstOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>
                    </WihView>
                    <WihView style={styles.container}>
                        <WihText style={styles.labels}>{t(Labels.labels.lastOccurrence)}: </WihText>
                        <WihText>{state.LastOccurrence?.toLocaleDateString() ?? "N/A"}</WihText>
                    </WihView>
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
                    <WihText>{state.DinnerTime ? timeDisplayString(state.DinnerTime) : "-"}</WihText>
                </WihIconRow>
            </WihView>
        )
    }
}

const components: Array<WihFlowStep<RepeatedEvent>> = [
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