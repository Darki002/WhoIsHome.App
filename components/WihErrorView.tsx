import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {WihRefreshableScrollView} from "@/components/WihRefreshableScrollView";
import {WihResponse} from "@/helper/fetch/WihResponse";
import * as Sentry from "@sentry/react-native";

export function WihErrorView({response, refresh} : {response?: WihResponse<any> | null, refresh: () => Promise<void>}){
    const {t} = useTranslation();

    Sentry.captureMessage(`Showing error: ${response?.getErrorMessage()}`);

    return(
        <WihView center="full">
            <WihRefreshableScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                onRefresh={[refresh]}
            >
                <WihTitle>{t(Labels.errors.generic)}</WihTitle>
                <WihText>{response?.getErrorMessage() ?? "Unknown error"}</WihText>
            </WihRefreshableScrollView>
        </WihView>
    )
}