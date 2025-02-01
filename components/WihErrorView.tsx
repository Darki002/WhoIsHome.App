import {WihResponse} from "@/helper/WihFetch";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {WihRefreshableScrollView} from "@/components/WihRefreshableScrollView";

export function WihErrorView({response, refresh} : {response?: WihResponse<any> | null, refresh: () => Promise<void>}){
    const {t} = useTranslation();

    return(
        <WihView center="full">
            <WihRefreshableScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                onRefresh={[refresh]}
            >
                <WihTitle>{t(Labels.errors.generic)}</WihTitle>
                <WihText>{response?.error ?? "Unknown error"}</WihText>
            </WihRefreshableScrollView>
        </WihView>
    )
}