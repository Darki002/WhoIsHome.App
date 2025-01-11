import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import useWihApiInterval from "@/hooks/wihApi/useWihApiInterval";
import {Pressable} from "react-native";
import {router} from "expo-router";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";
import WihLoading from "@/components/WihLoading";

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
                <WihLoading />
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
            {response.response!.map((o, i) => <DailyOverview key={i} overview={o} />)}
        </WihView>
    );
}

function DailyOverview({overview}: {overview: DailyOverview}) {
    return (
        <Pressable onPress={() => router.push(`/protected/user/${overview.user.id}`)}>
            <WihView center="horizontal">
                <WihTitle>{overview.user.username}</WihTitle>
                <WihText>Is at home: {overview.isAtHome ? "yes" : "no"}</WihText>
                {overview.dinnerTime ? <WihText>{overview.dinnerTime}</WihText> : undefined}
            </WihView>
        </Pressable>
    )
}
