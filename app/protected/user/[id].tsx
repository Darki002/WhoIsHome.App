import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {UserOverviewDto} from "@/constants/WihTypes/WihTypes";
import WihLoading from "@/components/WihLoading";
import WihEventList from "@/components/wihEvent/WihEventList";
import {useEffect} from "react";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

export default function UserView() {
    const {t} = useTranslation();
    const {id} = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const user = useWihApi<User | null>({
        endpoint: Endpoints.user.withId(id),
        method: "GET",
    });
    const response = useWihApiFocus<UserOverviewDto>({
        endpoint: Endpoints.userOverview.withId(id),
        method: "GET"
    });

    useEffect(() => {
        if (!user) {
            navigation.setOptions({title: t(Labels.headers.unknown)});
            return;
        }
        if (user.hasError) {
            navigation.setOptions({title: t(Labels.errors.header)});
            return;
        }
        navigation.setOptions({title: user.response?.userName});
    }, [user]);

    if (!response || !user) {
        return <WihLoading/>
    }

    if (response.hasError) {
        console.log(response.error);
        return (
            <WihView center="full">
                <WihText>{t(Labels.errors.generic)}</WihText>
            </WihView>
        )
    }

    if (user.hasError) {
        console.log(user.error);
        return (
            <WihView center="full">
                <WihText>{t(Labels.errors.generic)}</WihText>
            </WihView>
        )
    }

    const overview = response.response;
    return (
        <WihView center="horizontal">
            <WihTitle>{user.response!.userName}</WihTitle>

            <WihEventList events={overview?.today} title={t(Labels.subTitles.today)}/>
            <WihEventList events={overview?.thisWeek} title={t(Labels.subTitles.thisWeek)}/>
            <WihEventList events={overview?.futureEvents} title={t(Labels.subTitles.other)}/>
        </WihView>
    )
}