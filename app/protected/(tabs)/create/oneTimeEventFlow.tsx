import {WihFlow, WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import {WihText, WihTitle} from "@/components/WihText";
import React, {useCallback} from "react";
import WihView from "@/components/WihView";
import {WihDateInput} from "@/components/input/WihDateTimeInput";
import {formatDate, formatTime} from "@/helper/datetimehelper";
import TitleStep from "@/components/pages/CreateFlow/TitleStep";
import DinnerTimeStep from "@/components/pages/CreateFlow/DinnerTimeStep";
import {DateStepBase, DateValidationBase} from "@/components/pages/CreateFlow/DateStepBase";
import useCreateFlowCallbacks from "@/hooks/useCreateFlowCallbacks";
import {OneTimeEvent, OneTimeEventDto} from "@/constants/WihTypes/Event/OneTimeEvent";

const defaultOneTimeEvent: OneTimeEvent = {
    Title: "",
    Date: new Date(),
    StartTime: new Date(),
    EndTime: new Date(),
    PresenceType: "Unknown",
    DinnerTime: null,
};

export default function OneTimeEventFlow() {
    const [callWihApi, onCancel] = useCreateFlowCallbacks("OneTimeEvent");

    const onFinish = useCallback((state: OneTimeEvent) => {
        const body: OneTimeEventDto = {
            Title: state.Title!,
            Date: formatDate(state.Date!),
            StartTime: formatTime(state.StartTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body); // TODO: creates event 2 times...
    }, [callWihApi]);

    return <WihFlow<OneTimeEvent> initValue={defaultOneTimeEvent} onFinish={onFinish} onCancel={onCancel}
                                  steps={components}/>
}

const dateStep: WihFlowStep<OneTimeEvent> = {
    validate: (state: OneTimeEvent) => state.Date !== undefined && DateValidationBase(state),
    component: ({state, setState, isInvalid}: WihFlowComponentProps<OneTimeEvent>) => (
        <DateStepBase state={state} setState={setState} isInvalid={isInvalid}>
            <WihView flex="row">
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
    component: ({state}: WihFlowComponentProps<OneTimeEvent>) => (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
            <WihText>Date: {state.Date?.toLocaleDateString()}</WihText>
            <WihText>Time: {state.StartTime?.toLocaleTimeString()} - {state.EndTime?.toLocaleTimeString()}</WihText>
            <WihText>PresenceType: {state.PresenceType}</WihText>
            <WihText>Dinner Time: {state.DinnerTime?.toLocaleTimeString() ?? "-"}</WihText>
        </WihView>
    )
}

const components: Array<WihFlowStep<OneTimeEvent>> = [
    TitleStep,
    dateStep,
    DinnerTimeStep,
    summaryStep
];