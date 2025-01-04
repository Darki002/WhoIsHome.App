import {WihFlowComponentProps} from "@/components/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTimeInput} from "@/components/input/WihDateTimeInput";
import React, {PropsWithChildren} from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";

export function DateValidationBase(state: EventBase) : boolean{
    return !!state.StartTime && !!state.EndTime && state.StartTime < state.EndTime;
}

export const DateStepBase = ({ state, setState, isInvalid, children }: PropsWithChildren<WihFlowComponentProps<EventBase>>) => (
        <WihView center="full">
            <WihTitle>Event Date & Time</WihTitle>

            {children}

            <WihView flex="row">
                <WihText>Start:</WihText>
                <WihTimeInput
                    value={state.StartTime}
                    onChange={(time) => setState({StartTime: time})}/>
            </WihView>
            {isInvalid && !state.StartTime && <WihText style={{color: "red"}}>StateTime is required</WihText> }

            <WihView flex="row">
                <WihText>End:</WihText>
                <WihTimeInput
                    value={state.EndTime}
                    onChange={(time) => setState({EndTime: time})}/>
            </WihView>
            {isInvalid && !state.EndTime && <WihText style={{color: "red"}}>EndTime is required</WihText> }
        </WihView>
);