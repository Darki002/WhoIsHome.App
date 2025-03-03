import {WihFlowComponentProps, WihFlowStep} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihComponents/view/WihView";
import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import React from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {WihTextInput} from "@/components/WihComponents/input/WihTextInput";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

function titleStepValidation(state: EventBase) {
    return !!state.Title && state.Title.length >= 1 && state.Title.length < 50;
}

function TitleStepComponent({state, setState, isInvalid}: WihFlowComponentProps<EventBase>) {
    const {t} = useTranslation();
    const theme = useWihTheme();

    return (
        <WihView gap={20} style={{ paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}>
            <WihTitle>{t(Labels.titles.createFlow.titleStep)}</WihTitle>
            <WihText style={{ textAlign: "center" }}>{t(Labels.descriptions.createFlow.titleStep)}</WihText>

            <WihTextInput
                value={state.Title}
                placeholder={t(Labels.placeholders.title)}
                onChangeText={(title) => setState({ Title: title })}
            />

            {isInvalid && (
                <WihText style={{ color: theme.error, fontSize: 14, marginTop: 5 }}>
                    {t(Labels.errors.validation.title)}
                </WihText>
            )}
        </WihView>
    );
}

const TitleStep: WihFlowStep<EventBase> = {
    validate: titleStepValidation,
    component: TitleStepComponent
}

export default TitleStep;