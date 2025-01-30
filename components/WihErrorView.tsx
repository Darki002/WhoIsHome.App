import {WihResponse} from "@/helper/WihFetch";
import {RefreshControl, ScrollView} from "react-native";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {useCallback, useState} from "react";

export function WihErrorView({response, refresh} : {response?: WihResponse<any> | null, refresh: (callback: () => void) => void}){
    const {t} = useTranslation();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refresh(() => setRefreshing(false));
    }, []);

    return(
        <WihView center="full">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <WihTitle>{t(Labels.errors.generic)}</WihTitle>
                <WihText>{response?.error ?? "Unknown error"}</WihText>
            </ScrollView>
        </WihView>
    )
}