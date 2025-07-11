import {WihFlowComponentProps} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import React, {PropsWithChildren} from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {WihTimePicker} from "@/components/WihComponents/input/datetime/WihTimePicker";

export function DateValidationBase(state: EventBase): boolean {
    return state.StartTime !== undefined && (state.EndTime ? state.StartTime <= state.EndTime : true);
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

            <WihView flex="row" style={{alignItems: "center", gap: 10}}>
                <WihText>{t(Labels.labels.startTime)}:</WihText>
                <WihTimePicker
                    value={state.StartTime}
                    onChange={(time) => setState({StartTime: time})}/>
            </WihView>
            {isInvalid && !state.StartTime && <WihText style={{color: theme.error}}>{t(Labels.errors.validation.startTime)}</WihText>}

            <WihView flex="row" style={{alignItems: "center", gap: 10}}>
                <WihText>{t(Labels.labels.endTime)}:</WihText>
                <WihTimePicker
                    value={state.EndTime}
                    onChange={(time) => setState({EndTime: time})}/>
            </WihView>
        </WihView>
    );
};