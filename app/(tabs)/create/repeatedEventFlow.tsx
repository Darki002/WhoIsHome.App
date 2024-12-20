import {WihFlow, WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import { WihText, WihTitle } from "@/components/WihText";
import React, { useCallback } from "react";
import WihView from "@/components/WihView";
import { WihDateInput } from "@/components/input/WihDateTimeInput";
import { formatDate, formatTime } from "@/components/helper/datetimehelper";
import {RepeatedEvent, RepeatedEventDto} from "@/constants/WihTypes";
import TitleStep from "@/components/createFlow/TitleStep";
import DinnerTimeStep from "@/components/createFlow/DinnerTimeStep";
import {DateStepBase, DateValidationBase} from "@/components/createFlow/DateStepBase";
import useCreateFlowCallbacks from "@/hooks/useCreateFlowCallbacks";

const defaultOneTimeEvent: RepeatedEvent = {
    Title: "",
    FirstOccurrence: undefined,
    LastOccurrence: undefined,
    StateTime: new Date(),
    EndTime: new Date(),
    PresenceType: "Unknown",
    DinnerTime: null,
};

export default function RepeatedEventFlow() {
    const [callWihApi, onCancel] = useCreateFlowCallbacks("RepeatedEvent");

    const onFinish = useCallback((state: RepeatedEvent) => {
        const body: RepeatedEventDto = {
            Title: state.Title!,
            FirstOccurrence: formatDate(state.FirstOccurrence!),
            LastOccurrence: formatDate(state.LastOccurrence!),
            StateTime: formatTime(state.StateTime!),
            EndTime: formatTime(state.EndTime!),
            PresenceType: state.PresenceType!,
            DinnerTime: state.DinnerTime ? formatTime(state.DinnerTime) : null
        }
        callWihApi(body);
    }, [callWihApi]);

    return <WihFlow<RepeatedEvent> initValue={defaultOneTimeEvent} onFinish={onFinish} onCancel={onCancel} steps={components} />
}

const dateStep : WihFlowStep<RepeatedEvent> = {
    validate: (state: RepeatedEvent) => !!state.FirstOccurrence && !!state.LastOccurrence && state.FirstOccurrence < state.LastOccurrence && DateValidationBase(state),
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<RepeatedEvent>) => (
        <DateStepBase state={state} setState={setState} isInvalid={isInvalid}>
            <WihView flex="row">
                <WihText>First Occurrence:</WihText>
                <WihDateInput
                    value={state.FirstOccurrence}
                    onChange={(date) => setState({FirstOccurrence: date})}/>
            </WihView>
            {isInvalid && !state.FirstOccurrence && <WihText style={{color: "red"}}>FirstOccurrence is required</WihText> }

            <WihView flex="row">
                <WihText>Last Occurrence:</WihText>
                <WihDateInput
                    value={state.LastOccurrence}
                    onChange={(date) => setState({LastOccurrence: date})}/>
            </WihView>
            {isInvalid && !state.LastOccurrence && <WihText style={{color: "red"}}>LastOccurrence is required</WihText> }
        </DateStepBase>
    )
}

const summaryStep : WihFlowStep<RepeatedEvent> = {
    validate: (_: RepeatedEvent) => true,
    component: ({ state }: WihFlowComponentProps<RepeatedEvent>) => (
        <WihView center="full">
            <WihTitle>Summary</WihTitle>
            <WihText>Title: {state.Title}</WihText>
            <WihText>First: {state.FirstOccurrence?.toLocaleDateString()}</WihText>
            <WihText>Last: {state.LastOccurrence?.toLocaleDateString()}</WihText>
            <WihText>Time: {state.StateTime?.toLocaleTimeString()} - {state.EndTime?.toLocaleTimeString()}</WihText>
            <WihText>PresenceType: {state.PresenceType}</WihText>
            <WihText>Dinner Time: {state.DinnerTime?.toLocaleTimeString() ?? "-"}</WihText>
        </WihView>
    )
}

const components : Array<WihFlowStep<RepeatedEvent>> = [
    TitleStep,
    dateStep,
    DinnerTimeStep,
    summaryStep
];