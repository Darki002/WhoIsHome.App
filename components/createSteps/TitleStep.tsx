import {WihFlowComponentProps, WihFlowStep} from "@/components/wihFlow/wihFlow";
import {EventBase} from "@/constants/WihTypes";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTextInput} from "@/components/input/WihInput";
import React from "react";

const TitleStep : WihFlowStep<EventBase> = {
    validate: (state: EventBase) => !!state.Title, /* TODO: check conditions for Title like max and min length */
    component: ({ state, setState, isInvalid }: WihFlowComponentProps<EventBase>) => (
        <WihView center="full">
            <WihTitle>Event Title</WihTitle>
            <WihTextInput
                value={state.Title}
                onChangeText={(title) => setState({Title: title})}/>
            {isInvalid && <WihText style={{color: "red"}}>Title must be between 5 - 10 characters</WihText> }
        </WihView>
    )
}

export default TitleStep;