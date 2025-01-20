import {WihFlowComponentProps, WihFlowStep} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import React from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {WihTextInput} from "@/components/input/WihTextInput";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

function titleStepValidation(state: EventBase) {
    return !!state.Title && state.Title.length >= 1 && state.Title.length < 50;
}

function TitleStepComponent({state, setState, isInvalid}: WihFlowComponentProps<EventBase>) {
    const {t} = useTranslation();

    return (
        <WihView center="full">
            <WihTitle>{t(Labels.titles.createFlow.titleStep)}</WihTitle>
            <WihText>{t(Labels.descriptions.createFlow.titleStep)}</WihText>
            <WihTextInput
                value={state.Title}
                placeholder="Title"
                onChangeText={(title) => setState({Title: title})}/>
            {isInvalid && <WihText style={{color: "red"}}>Title must be between 1 - 50 characters</WihText>}
        </WihView>
    )
}

const TitleStep: WihFlowStep<EventBase> = {
    validate: titleStepValidation,
    component: TitleStepComponent
}

export default TitleStep;