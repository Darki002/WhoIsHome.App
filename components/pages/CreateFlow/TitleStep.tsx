import {WihFlowComponentProps, WihFlowStep} from "@/components/framework/wihFlow/wihFlow";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import React from "react";
import {EventBase} from "@/constants/WihTypes/Event/BaseTypes";
import {WihTextInput} from "@/components/input/WihTextInput";

const TitleStep: WihFlowStep<EventBase> = {
    validate: (state: EventBase) => !!state.Title && state.Title.length >= 1 && state.Title.length < 50,
    component: ({state, setState, isInvalid}: WihFlowComponentProps<EventBase>) => (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                placeholder="Title"
                onChangeText={(title) => setState({Title: title})}/>
            {isInvalid && <WihText style={{color: "red"}}>Title must be between 1 - 50 characters</WihText>}
        </WihView>
    )
}

export default TitleStep;