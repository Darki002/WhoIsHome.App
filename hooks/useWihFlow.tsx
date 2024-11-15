import React, {ComponentType, useState} from "react";
import {WihFlowNavAction, WihFlowNavBar} from "@/components/wihFlow/WihFlowNavigation";

export interface WihFlowComponent<T> {
    state: T;
    setState: React.Dispatch<React.SetStateAction<T>>
}

export type WihFlowParam<T> = {
    initValue: T;
    onFinish: (state : T) => void;
    onCancel: () => void;
    components: Array<ComponentType<WihFlowComponent<T>>>;
}

export function useWihFlow<T>({initValue, onFinish, onCancel, components} : WihFlowParam<T>) : [T, React.JSX.Element | null] {
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

    const CurrentComponent = components[currentStep];
    const element = CurrentComponent  ?  <CurrentComponent state={state} setState={setState} /> : null;

    if(!element){
        return [state, null];
    }

    const currentFlowView = (
        <WihFlowNavBar
            currentStep={currentStep}
            lastStep={components.length - 1}
            onNavAction={onNavAction}
            children={element} />
    );

    return [state, currentFlowView];
}