import React, { ComponentType, useState } from "react";
import { WihFlowNavAction, WihFlowNavBar } from "@/components/wihFlow/WihFlowNavigation";
import { WihTitle } from "@/components/WihText";

export interface WihFlowComponentProps<T> {
    state: T;
    setState: (changes: T) => void;
    isInvalid: boolean;
}

export type WihFlowComponentType<T> = ComponentType<WihFlowComponentProps<T>>;

export interface WihFlowStep<T> {
    component: WihFlowComponentType<T>;
    validate: (state: T) => boolean;
}


export type WihFlowParam<T> = {
    initValue?: T;
    onFinish: (state: T) => void;
    onCancel: () => void;
    steps: Array<WihFlowStep<T>>;
}

export function WihFlow<T extends object>({
    initValue = {} as T,
    onFinish,
    onCancel,
    steps
}: WihFlowParam<T>) {
    const [state, setState] = useState<T>(initValue);
    const [currentStepNumber, setStep] = useState<number>(0);
    const [isValid, setIsValid] = useState<boolean>(false);

    const currentStep = steps[currentStepNumber];

    function onNavAction(action: WihFlowNavAction) {
        setIsValid(currentStep.validate(state));
        switch (action) {
            case "Next":
                if (isValid) {
                    setStep(currentStepNumber + 1);
                }
                break;
            case "Finish":
                if (isValid) {
                    onFinish(state);
                }
                break;
            case "Back":
                setIsValid(true);
                setStep(currentStepNumber - 1);
                break;
            case "Cancel":
                setIsValid(true);
                onCancel();
                break;
        }
    }

    function onStateChange(changes: T) {
        setState({ ...state, ...changes });
    }

    const CurrentComponent = currentStep.component;
    const element = CurrentComponent
        ? <CurrentComponent state={state} setState={onStateChange} isInvalid={!isValid} />
        : null;

    if (!element) {
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