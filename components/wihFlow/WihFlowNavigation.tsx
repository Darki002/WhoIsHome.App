import {ReactNode} from "react";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/input/WihButton";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

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