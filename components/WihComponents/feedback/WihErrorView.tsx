import WihView from "@/components/WihComponents/view/WihView";
import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import {WihResponse} from "@/helper/fetch/WihResponse";
import {WihLogger} from "@/helper/WihLogger";

export function WihErrorView({error, refresh} : {error: WihResponse<any> | Error | string | null, refresh: () => void}){
    const {t} = useTranslation();

    const errorMessage = error instanceof WihResponse
        ? error!.getErrorMessage()
        : error ?? "Unknown Error";

    WihLogger.error(errorMessage);

    return(
        <WihView center="full">
            <WihRefreshableScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                onRefresh={refresh}
            >
                <WihTitle>{t(Labels.errors.generic)}</WihTitle>
                <WihText>{`${errorMessage}`}</WihText>
            </WihRefreshableScrollView>
        </WihView>
    )
}