import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";
import {EventBase, PresenceType} from "@/constants/WihTypes";
import {WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTimeInput} from "@/components/input/WihDateTimeInput";
import React from "react";

const options: Array<WihOption<PresenceType>> = [
    {value: "Unknown", display: "Unknown"},
    {value: "Late", display: "Late"},
    {value: "NotPresent", display: "NotPresent"}
]

const DinnerTimeStep: WihFlowStep<EventBase> = {
    validate: (state: EventBase) => !!state.DinnerTime && state.PresenceType !== null && state.DinnerTime > state.EndTime!,
    component: ({state, setState, isInvalid}: WihFlowComponentProps<EventBase>) => (
        <WihView center="full">
            <WihTitle>Dinner Time?</WihTitle>

            <WihSingleChoice<PresenceType>
                value={"Unknown"}
                options={options}
                onChange={(c: PresenceType | null) => setState({PresenceType: c ?? undefined})}/>

            {isInvalid && state.PresenceType === null && !state.EndTime &&
                <WihText style={{color: "red"}}>PresenceType is required</WihText>}
            <WihTimeInput
                value={state.DinnerTime ?? undefined}
                onChange={(time) => setState({DinnerTime: time})}
                disabled={state.PresenceType !== "Late"}/>
            {isInvalid && !state.DinnerTime && !state.EndTime &&
                <WihText style={{color: "red"}}>DinnerTime is required</WihText>}
        </WihView>
    )
}

export default DinnerTimeStep;