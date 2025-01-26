import {WihFlow, WihFlowComponentProps, WihFlowStep} from "@/components/framework/wihFlow/wihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import React, {useCallback} from "react";
import WihView from "@/components/WihView";
import {WihDateInput} from "@/components/input/DateTime/WihDateInput";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import TitleStep from "@/components/pages/CreateFlow/TitleStep";
import DinnerTimeStep from "@/components/pages/CreateFlow/DinnerTimeStep";
import {DateStepBase, DateValidationBase} from "@/components/pages/CreateFlow/DateStepBase";
import useCreateFlowCallbacks from "@/hooks/useCreateFlowCallbacks";
import {OneTimeEvent, OneTimeEventDto} from "@/constants/WihTypes/Event/OneTimeEvent";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

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
    component: ({state, setState, isInvalid}: WihFlowComponentProps<OneTimeEvent>) => (
        <DateStepBase state={state} setState={setState} isInvalid={isInvalid}>
            <WihView style={{flexDirection: "row"}}>
                <WihText>Date:</WihText>
                <WihDateInput
                    value={state.Date}
                    onChange={(date) => setState({Date: date})}/>
            </WihView>
            {isInvalid && !state.Date && <WihText style={{color: "red"}}>Date is required</WihText>}
        </DateStepBase>
    )
}

const summaryStep: WihFlowStep<OneTimeEvent> = {
    validate: (_: OneTimeEvent) => true,
    component: ({state}: WihFlowComponentProps<OneTimeEvent>) => {
        const {t} = useTranslation();
        return (
            <WihView style={{alignItems: "center", justifyContent: "center"}}>
                <WihTitle>{t(Labels.titles.summary)}</WihTitle>
                <WihText>Title: {state.Title}</WihText>
                <WihText>Date: {state.Date?.toLocaleDateString()}</WihText>
                <WihText>Time: {state.StartTime?.toLocaleTimeString()} - {state.EndTime?.toLocaleTimeString()}</WihText>
                <WihText>PresenceType: {state.PresenceType}</WihText>
                <WihText>Dinner Time: {state.DinnerTime?.toLocaleTimeString() ?? "-"}</WihText>
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