import {WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import useWihApiInterval from "@/hooks/wihApi/useWihApiInterval";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";
import WihLoading from "@/components/WihLoading";
import {DailyOverviewCard} from "@/components/wihEvent/DailyOverviewCard";
import {DailyOverview, DailyOverviewDto} from "@/constants/WihTypes/DailyOverview";
import {StyleSheet} from "react-native";
import {WihErrorView} from "@/components/WihErrorView";

const TIME = 5 * 60 * 1000;

export default function Index() {
    const {t} = useTranslation();
    const [response, refresh] = useWihApiInterval<DailyOverviewDto[]>({
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

    if (response.hasError || !response.response) {
        return <WihErrorView response={response} refresh={refresh} />
    }

    const overviews = response.response.map(r => new DailyOverview(r));

    return (
        <WihView  style={styles.container}>
            <WihTitle style={styles.title}>{t(Labels.titles.welcome)}!</WihTitle>
            {overviews.map((o, i) => <DailyOverviewCard key={i} overview={o} />)}
        </WihView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 25,
        marginBottom: 20
    }
})
