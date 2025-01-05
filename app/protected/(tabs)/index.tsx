import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import useWihApiInterval from "@/hooks/wihApi/useWihApiInterval";
import {Pressable} from "react-native";
import {router} from "expo-router";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";

const TIME = 5 * 60 * 1000;

type DailyOverview = {
    user: {
        id: number;
        username: string;
    };
    isAtHome: boolean;
    dinnerTime: string | null;
}

export default function Index() {
    const {t} = useTranslation();
    const response = useWihApiInterval<DailyOverview[]>({
        time: TIME,
        method: "GET",
        endpoint: Endpoints.dailyOverview
    });

    if (!response) {
        return (
            <WihView center="full">
                <WihTitle>Loading...</WihTitle>
            </WihView>
        )
    }

    if (response.hasError) {
        return (
            <WihView center="full">
                <WihTitle>{t(Labels.errors.generic)}</WihTitle>
            </WihView>
        )
    }

    return (
        <WihView center="horizontal">
            <WihTitle style={{fontSize: 25}}>{t(Labels.titles.welcome)}!</WihTitle>
            {response.response!.map((o, i) => DailyOverview(o, i))}
        </WihView>
    );
}

function DailyOverview(overview: DailyOverview, key: number) {
    const {t} = useTranslation();
    return (
        <Pressable onPress={() => router.push(`/protected/user/${overview.user.id}`)} key={key}>
            <WihView center="horizontal">
                <WihTitle>{overview.user.username}</WihTitle>
                <WihText>Is at home: {overview.isAtHome ? "yes" : "no"}</WihText> // TODO: Translate or with symbol
                {overview.dinnerTime ? <WihText>{overview.dinnerTime}</WihText> : null}
            </WihView>
        </Pressable>
    )
}
