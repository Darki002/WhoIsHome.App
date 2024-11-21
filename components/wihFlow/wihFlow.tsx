import React, {ComponentType, useState} from "react";
import {WihFlowNavAction, WihFlowNavBar} from "@/components/wihFlow/WihFlowNavigation";
import {WihText, WihTitle} from "@/components/WihText";
import Interceptors from "undici/types/interceptors";
import retry = Interceptors.retry;

export interface WihFlowComponent<T> {
    state: T;
    setState: (changes: T) => void;
}

export type WihFlowParam<T> = {
    initValue?: T;
    onFinish: (state: T) => void;
    onCancel: () => void;
    components: Array<ComponentType<WihFlowComponent<T>>>;
}

export function WihFlow<T extends object>({
  initValue = {} as T,
  onFinish,
  onCancel,
  components
} : WihFlowParam<T>) {
    const [state, setState] = useState<T>(initValue);
    const [currentStep, setStep] = useState<number>(0);

    function onNavAction(action : WihFlowNavAction) {
        switch (action) {
            case "Next":
                setStep(currentStep + 1);
                break;
            case "Finish":
                onFinish(state);
                break;
            case "Back":
                setStep(currentStep - 1);
                break;
            case "Cancel":
                onCancel();
                break;
        }
    }

    function onStateChange(changes: T){
        setState({...state, ...changes});
    }

    const CurrentComponent = components[currentStep];
    const element = CurrentComponent  ?  <CurrentComponent state={state} setState={onStateChange} /> : null;

    if(!element){
        return <WihTitle>Oops, no more steps</WihTitle>
    }

    return (
        <WihFlowNavBar
            currentStep={currentStep}
            lastStep={components.length - 1}
            onNavAction={onNavAction}
            children={element} />
    );
}