import {WihFlowComponentProps} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTimeInput} from "@/components/input/DateTime/WihTimeInput";
import React, {PropsWithChildren} from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

export function DateValidationBase(state: EventBase): boolean {
    return state.StartTime !== undefined && state.EndTime !== undefined && state.StartTime <= state.EndTime;
}

export const DateStepBase = ({
                                 state,
                                 setState,
                                 isInvalid,
                                 children
                             }: PropsWithChildren<WihFlowComponentProps<EventBase>>) => {
    const {t} = useTranslation();
    const theme = useWihTheme();

    return (
        <WihView gap={20} style={{alignItems: "center", justifyContent: "center"}}>
            <WihTitle>{t(Labels.titles.createFlow.dateStep)}</WihTitle>

            {children}

            <WihView flex="row" style={{alignItems: "center"}}>
                <WihText>{t(Labels.labels.startTime)}:</WihText>
                <WihTimeInput
                    value={state.StartTime}
                    onChange={(time) => setState({StartTime: time})}/>
            </WihView>
            {isInvalid && !state.StartTime && <WihText style={{color: theme.error}}>{t(Labels.errors.validation.startTime)}</WihText>}

            <WihView flex="row" style={{alignItems: "center"}}>
                <WihText>{t(Labels.labels.endTime)}:</WihText>
                <WihTimeInput
                    value={state.EndTime}
                    onChange={(time) => setState({EndTime: time})}/>
            </WihView>
            {isInvalid && !state.EndTime && <WihText style={{color: theme.error}}>{t(Labels.errors.validation.endTime)}</WihText>}
        </WihView>
    );
};