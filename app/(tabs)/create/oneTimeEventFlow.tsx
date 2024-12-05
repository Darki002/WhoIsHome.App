import {WihFlow, WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import { WihText, WihTitle } from "@/components/WihText";
import React, { useCallback } from "react";
import WihView from "@/components/WihView";
import { WihDateInput } from "@/components/input/WihDateTimeInput";
import { formatDate, formatTime } from "@/components/helper/datetimehelper";
import {OneTimeEvent, OneTimeEventDto} from "@/constants/WihTypes";
import TitleStep from "@/components/createFlow/TitleStep";
import DinnerTimeStep from "@/components/createFlow/DinnerTimeStep";
import {DateStepBase, DateValidationBase} from "@/components/createFlow/DateStepBase";
import useCreateFlowCallbacks from "@/hooks/useCreateFlowCallbacks";

const defaultOneTimeEvent: OneTimeEvent = {
    Title: "",
    Date: new Date(),
    StateTime: new Date(),
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
            StateTime: formatTime(state.StateTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body);
    }, [callWihApi]);

    return <WihFlow<OneTimeEvent> initValue={defaultOneTimeEvent} onFinish={onFinish} onCancel={onCancel} steps={components} />
}

const dateStep : WihFlowStep<OneTimeEvent> = {
    validate: (state: OneTimeEvent) => !!state.Date && DateValidationBase(state),
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<OneTimeEvent>) => (
        <DateStepBase state={state} setState={setState} isInvalid={isInvalid}>
            <WihView flex="row">
                <WihText>Date:</WihText>
                <WihDateInput
                    value={state.Date}
                    onChange={(date) => setState({Date: date})}/>
            </WihView>
            {isInvalid && !state.Date && <WihText style={{color: "red"}}>Date is required</WihText> }
        </DateStepBase>
    )
}

const summaryStep : WihFlowStep<OneTimeEvent> = {
    validate: (_: OneTimeEvent) => true,
    component: ({ state }: WihFlowComponentProps<OneTimeEvent>) => (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
            <WihText>Date: {state.Date?.toLocaleDateString()}</WihText>
            <WihText>Time: {state.StateTime?.toLocaleTimeString()} - {state.EndTime?.toLocaleTimeString()}</WihText>
            <WihText>PresenceType: {state.PresenceType}</WihText>
            <WihText>Dinner Time: {state.DinnerTime?.toLocaleTimeString() ?? "-"}</WihText>
        </WihView>
    )
}

const components : Array<WihFlowStep<OneTimeEvent>> = [
    TitleStep,
    dateStep,
    DinnerTimeStep,
    summaryStep
];