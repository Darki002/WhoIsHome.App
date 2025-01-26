import {ReactNode} from "react";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/input/WihButton";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import WihDivider from "@/components/WihDivider";

export type WihFlowNavAction = "Next" | "Back" | "Cancel" | "Finish";

export interface WihFlowNavigationProps {
    currentStepNumber: number;
    validate: () => boolean;
    lastStep: number;
    onNavAction: (action: WihFlowNavAction) => void;
    children?: ReactNode;
}

export function WihFlowNavBar({ currentStepNumber, validate, lastStep, onNavAction, children }: WihFlowNavigationProps) {
    const {t} = useTranslation();
    const theme = useWihTheme();

    return (
        <WihView flex="column" center="full" gap={20} style={{ paddingHorizontal: 20 }}>
            {children}

            <WihDivider />

            <WihView flex="row" gap={15} style={{ marginTop: 20 }}>
                {currentStepNumber > 0 && (
                    <WihButton onPress={() => onNavAction("Back")}>
                        {t(Labels.actions.back)}
                    </WihButton>
                )}
                <WihButton onPress={() => onNavAction("Cancel")} style={{ backgroundColor: theme.error }}>
                    {t(Labels.actions.cancel)}
                </WihButton>
                {currentStepNumber < lastStep ? (
                    <WihButton onPress={() => onNavAction("Next")} disabled={!validate()}>
                        {t(Labels.actions.next)}
                    </WihButton>
                ) : (
                    <WihButton onPress={() => onNavAction("Finish")} disabled={!validate()}>
                        {t(Labels.actions.finish)}
                    </WihButton>
                )}
            </WihView>
        </WihView>
    );
}
