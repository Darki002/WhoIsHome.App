import {ReactNode} from "react";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/WihButton";

export type WihFlowNavAction = "Next" | "Back" | "Cancel" | "Finish";

export interface WihFlowNavigationProps {
    currentStep: number;
    lastStep: number;
    onNavAction: (action: WihFlowNavAction) => void;
    children?: ReactNode;
}

export function WihFlowNavBar({currentStep, lastStep, onNavAction, children}: WihFlowNavigationProps) {
    if(currentStep == 0){
        return <WihFlowNavStart onNavAction={onNavAction} children={children} />;
    }
    if(currentStep == lastStep){
        return <WihFlowNavEnd onNavAction={onNavAction} children={children} />;
    }
    return <WihFlowNav onNavAction={onNavAction} children={children} />;
}

function WihFlowNavStart({onNavAction, children}: {onNavAction: (action: WihFlowNavAction) => void, children?: ReactNode}) {
    return (
        <StepLayout content={children}>
                <WihButton onPress={() => onNavAction("Cancel")}>Cancel</WihButton>
                <WihButton onPress={() => onNavAction("Next")}>Next</WihButton>
        </StepLayout>
)
}

function WihFlowNav({
    onNavAction, children
}: {onNavAction: (action: WihFlowNavAction) => void, children?: ReactNode}) {
    return (
        <StepLayout content={children}>
                <WihButton onPress={() => onNavAction("Back")}>Back</WihButton>
                <WihButton onPress={() => onNavAction("Next")}>Next</WihButton>
        </StepLayout>
)
}

function WihFlowNavEnd({
    onNavAction, children}: {onNavAction: (action: WihFlowNavAction) => void, children?: ReactNode}) {
    return (
        <StepLayout content={children}>
                <WihButton onPress={() => onNavAction("Back")} >Back</WihButton>
                <WihButton onPress={() => onNavAction("Finish")} >Finish</WihButton>
        </StepLayout>
    )
}

function StepLayout({children, content} : {children : ReactNode, content : ReactNode}){
    return (
        <WihView center="full" flex="column" gap={15}>
            {content}
            <WihView flex="row" gap={15}>
                {children}
            </WihView>
        </WihView>
    );
}