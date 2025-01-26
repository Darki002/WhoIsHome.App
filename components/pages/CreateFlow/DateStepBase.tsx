import {WihFlowComponentProps} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTimeInput} from "@/components/input/DateTime/WihTimeInput";
import React, {PropsWithChildren} from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";

export function DateValidationBase(state: EventBase): boolean {
    return state.StartTime !== undefined && state.EndTime !== undefined && state.StartTime <= state.EndTime;
}

export const DateStepBase = ({
                                 state,
                                 setState,
                                 isInvalid,
                                 children
                             }: PropsWithChildren<WihFlowComponentProps<EventBase>>) => (
    <WihView gap={20} style={{alignItems: "center", justifyContent: "center"}}>
        <WihTitle>Event Date & Time</WihTitle>

        {children}

        <WihView flex="row">
            <WihText>Start:</WihText>
            <WihTimeInput
                value={state.StartTime}
                onChange={(time) => setState({StartTime: time})}/>
        </WihView>
        {isInvalid && !state.StartTime && <WihText style={{color: "red"}}>StateTime is required</WihText>}

        <WihView flex="row">
            <WihText>End:</WihText>
            <WihTimeInput
                value={state.EndTime}
                onChange={(time) => setState({EndTime: time})}/>
        </WihView>
        {isInvalid && !state.EndTime && <WihText style={{color: "red"}}>EndTime is required</WihText>}
    </WihView>
);