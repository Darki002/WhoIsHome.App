import {WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import {EventBase} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTextInput} from "@/components/input/WihInput";
import React from "react";

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