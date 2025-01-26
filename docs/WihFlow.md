# WihFlow

```typescript jsx
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
    const [isValid, setIsValid] = useState<boolean>(true);

    const currentStep = steps[currentStepNumber];

    function onStateChange(changes: Partial<T>) {
        setState((prev) => ({...prev, ...changes}));
    }

    function onNavAction(action: WihFlowNavAction) {
        const result = currentStep.validate(state);
        setIsValid(result);
        switch (action) {
            case "Next":
                if (result) {
                    setStep(currentStepNumber + 1);
                }
                break;
            case "Finish":
                if (result) {
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

    const CurrentComponent = currentStep.component;
    const element = CurrentComponent
        ? <CurrentComponent state={state} setState={onStateChange} isInvalid={!isValid}/>
        : null;

    if (!element) {
        return <WihTitle>Oops, no more steps</WihTitle>
    }

    return (
        <WihFlowNavBar
            currentStep={currentStepNumber}
            lastStep={steps.length - 1}
            onNavAction={onNavAction}
            children={element}/>
    );
}
```

# WihFlowNavBar

```typescript jsx

export type WihFlowNavAction = "Next" | "Back" | "Cancel" | "Finish";

export interface WihFlowNavigationProps {
    currentStep: number;
    lastStep: number;
    onNavAction: (action: WihFlowNavAction) => void;
    children?: ReactNode;
}

export function WihFlowNavBar({currentStep, lastStep, onNavAction, children}: WihFlowNavigationProps) {
    if (currentStep == 0) {
        return <WihFlowNavStart onNavAction={onNavAction} children={children}/>;
    }
    if (currentStep == lastStep) {
        return <WihFlowNavEnd onNavAction={onNavAction} children={children}/>;
    }
    return <WihFlowNav onNavAction={onNavAction} children={children}/>;
}

function WihFlowNavStart({onNavAction, children}: {
    onNavAction: (action: WihFlowNavAction) => void,
    children?: ReactNode
}) {
    const {t} = useTranslation();
    return (
        <StepLayout content={children}>
            <WihButton onPress={() => onNavAction("Cancel")}>{t(Labels.actions.cancel)}</WihButton>
            <WihButton onPress={() => onNavAction("Next")}>{t(Labels.actions.next)}</WihButton>
        </StepLayout>
    )
}

function WihFlowNav({onNavAction, children}: {
    onNavAction: (action: WihFlowNavAction) => void,
    children?: ReactNode
}) {
    const {t} = useTranslation();
    return (
        <StepLayout content={children}>
            <WihButton onPress={() => onNavAction("Back")}>{t(Labels.actions.back)}</WihButton>
            <WihButton onPress={() => onNavAction("Next")}>{t(Labels.actions.next)}</WihButton>
        </StepLayout>
    )
}

function WihFlowNavEnd({onNavAction, children}: {
    onNavAction: (action: WihFlowNavAction) => void,
    children?: ReactNode
}) {
    const {t} = useTranslation();
    return (
        <StepLayout content={children}>
            <WihButton onPress={() => onNavAction("Back")}>{t(Labels.actions.back)}</WihButton>
            <WihButton onPress={() => onNavAction("Finish")}>{t(Labels.actions.finish)}</WihButton>
        </StepLayout>
    )
}

function StepLayout({children, content}: { children: ReactNode, content: ReactNode }) {
    return (
        <WihView center="full">
            <WihView flex="column" style={{alignItems: "center"}} gap={15}>
                {content}
                <WihView flex="row" gap={15}>
                    {children}
                </WihView>
            </WihView>
        </WihView>
    )
}
```