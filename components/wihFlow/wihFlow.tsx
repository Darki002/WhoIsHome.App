import React, {ComponentType, useState} from "react";
import {WihFlowNavAction, WihFlowNavBar} from "@/components/wihFlow/WihFlowNavigation";
import {WihTitle} from "@/components/WihText";

export interface WihFlowComponentProps<T> {
    state: T;
    setState: (changes: T) => void;
}

export interface WihFlowComponentWithValidation {
    validate: () => boolean;
}

export type WihFlowComponent<T> = ComponentType<WihFlowComponentProps<T>>;

export interface WihFlowStep<T> {
    component: WihFlowComponent<T>;
    validate: (state: T) => boolean;
}

export type WihFlowParam<T> = {
    initValue?: T;
    onFinish: (state: T) => void;
    onCancel: () => void;
    steps: Array<WihFlowComponent<T>>;
}

export function WihFlow<T extends object>({
  initValue = {} as T,
  onFinish,
  onCancel,
  steps
} : WihFlowParam<T>) {
    const [state, setState] = useState<T>(initValue);
    const [currentStepNumber, setStep] = useState<number>(0);

    const onNavAction = (action : WihFlowNavAction) => {
        switch (action) {
            case "Next":
                setStep(currentStepNumber + 1);
                break;
            case "Finish":
                onFinish(state);
                break;
            case "Back":
                setStep(currentStepNumber - 1);
                break;
            case "Cancel":
                onCancel();
                break;
        }
    }

    function onStateChange(changes: T){
        setState({...state, ...changes});
    }

    const CurrentComponent = steps[currentStepNumber];
    const element = CurrentComponent  ?  <CurrentComponent state={state} setState={onStateChange} /> : null;

    if(!element){
        return <WihTitle>Oops, no more steps</WihTitle>
    }

    return (
        <WihFlowNavBar
            currentStep={currentStepNumber}
            lastStep={steps.length - 1}
            onNavAction={onNavAction}
            children={element} />
    );
}