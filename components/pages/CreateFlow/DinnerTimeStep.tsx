import {WihOption, WihSingleChoice} from "@/components/WihComponents/input/WihSingleChoice";
import {WihFlowComponentProps, WihFlowStep} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import React from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {WihTimePicker} from "@/components/WihComponents/input/datetime/WihTimePicker";

const options: Array<WihOption<PresenceType>> = [
    {value: "Unknown", displayTextLabel: Labels.presenceType.unknown},
    {value: "Late", displayTextLabel: Labels.presenceType.late},
    {value: "NotPresent", displayTextLabel: Labels.presenceType.notPresent}
];

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

const DinnerTimeStep: WihFlowStep<EventBase> = {
    validate: validateDinnerTimeStep,
    component: ({state, setState, isInvalid}: WihFlowComponentProps<EventBase>) => {
        const {t} = useTranslation();
        const theme = useWihTheme();

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
            <WihView gap={20} style={{alignItems: "center", justifyContent: "center"}}>
                <WihTitle>{t(Labels.titles.createFlow.dinnerTimeStep)}</WihTitle>

                <WihSingleChoice<PresenceType>
                    value={state.PresenceType}
                    options={options}
                    direction="row"
                    onChange={onPresenceTypeChange}/>

                {isInvalid && state.PresenceType === null && !state.EndTime &&
                    <WihText style={{color: theme.error}}>{t(Labels.errors.validation.presenceType)}</WihText>}

                <WihView flex="row" style={{alignItems: "center", gap: 10}}>
                    <WihText>{t(Labels.labels.dinnerTime)}:</WihText>
                    <WihTimePicker
                        value={state.DinnerTime ?? undefined}
                        onChange={onTimeChange}
                        disabled={state.PresenceType !== "Late"}/>
                    {isInvalid && !state.DinnerTime && !state.EndTime &&
                        <WihText style={{color: theme.error}}>{t(Labels.errors.validation.dinnerTime)}</WihText>}
                </WihView>
            </WihView>
        )
    }
}

export default DinnerTimeStep;