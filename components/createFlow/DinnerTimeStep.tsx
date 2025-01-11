import {WihOption, WihSingleChoice} from "@/components/input/WihSingleChoice";
import {WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTimeInput} from "@/components/input/DateTime/WihTimeInput";
import React from "react";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

const DinnerTimeStep : WihFlowStep<EventBase> = {
    validate: (state: EventBase) => !!state.DinnerTime && state.PresenceType !== null && state.DinnerTime > state.EndTime!,
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<EventBase>) => {
        const {t} = useTranslation();

        const options : Array<WihOption<PresenceType>> = [
            {value: "Unknown", display: t(Labels.presenceType.unknown)},
            {value: "Late", display: t(Labels.presenceType.late)},
            {value: "NotPresent", display: t(Labels.presenceType.notPresent)}
        ];

        return (
            <WihView center="full">
                <WihTitle>Dinner Time?</WihTitle>

                <WihSingleChoice<PresenceType>
                    value={"Unknown"}
                    options={options}
                    onChange={(c : PresenceType | undefined) => setState({PresenceType: c})} />

                {isInvalid && state.PresenceType === null && !state.EndTime && <WihText style={{color: "red"}}>PresenceType is required</WihText> }
                <WihTimeInput
                    value={state.DinnerTime ?? undefined}
                    onChange={(time) => setState({DinnerTime: time})}
                    disabled={state.PresenceType !== "Late"}/>
                {isInvalid && !state.DinnerTime && !state.EndTime && <WihText style={{color: "red"}}>DinnerTime is required</WihText> }
            </WihView>
        )
    }
}

export default DinnerTimeStep;