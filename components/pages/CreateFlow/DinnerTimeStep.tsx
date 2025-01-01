import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";
import {WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTimeInput} from "@/components/input/WihDateTimeInput";
import React from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {PresenceType} from "@/constants/WihTypes/PresenceType";

const options: Array<WihOption<PresenceType>> = [
    {value: "Unknown", display: "Unknown"},
    {value: "Late", display: "Late"},
    {value: "NotPresent", display: "Not Present"}
]

const DinnerTimeStep: WihFlowStep<EventBase> = {
    validate: validateDinnerTimeStep,
    component: ({state, setState, isInvalid}: WihFlowComponentProps<EventBase>) => {

        const onTimeChange = (time: Date | undefined) => {
            const value = state.PresenceType === "Late" ? time : null;
            setState({DinnerTime: value});
        }

        const onPresenceTypeChange = (presenceType: PresenceType | undefined) => {
            setState({PresenceType: presenceType});
            if (presenceType !== "Late") {
                setState({DinnerTime: null});
            }
        }

        return (
            <WihView center="full">
                <WihTitle>Dinner Time?</WihTitle>

                <WihSingleChoice<PresenceType>
                    value={state.PresenceType}
                    options={options}
                    onChange={onPresenceTypeChange}/>

                {isInvalid && state.PresenceType === null && !state.EndTime &&
                    <WihText style={{color: "red"}}>PresenceType is required</WihText>}
                <WihTimeInput
                    value={state.DinnerTime ?? undefined}
                    onChange={onTimeChange}
                    disabled={state.PresenceType !== "Late"}/>
                {isInvalid && !state.DinnerTime && !state.EndTime &&
                    <WihText style={{color: "red"}}>DinnerTime is required</WihText>}
            </WihView>
        )
    }
}

function validateDinnerTimeStep(state: EventBase): boolean {
    if (state.PresenceType === null) {
        return false;
    }
    switch (state.PresenceType) {
        case null:
            return false;
        case "Unknown":
        case "NotPresent":
            return !state.DinnerTime;
        case "Late":
            if (!state.DinnerTime) return false;
            return state.DinnerTime > state.EndTime!;
        default:
            return false;
    }
}

export default DinnerTimeStep;