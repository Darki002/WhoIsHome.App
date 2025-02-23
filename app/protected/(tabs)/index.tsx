import {WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";
import WihLoading from "@/components/WihLoading";
import {DailyOverviewCard} from "@/components/wihEvent/DailyOverviewCard";
import {DailyOverview, DailyOverviewDto} from "@/constants/WihTypes/DailyOverview";
import {StyleSheet} from "react-native";
import {WihErrorView} from "@/components/WihErrorView";
import {WihRefreshableScrollView} from "@/components/WihRefreshableScrollView";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";

export default function Index() {
    const {t} = useTranslation();
    const [response, refresh] = useWihApiFocus<DailyOverviewDto[]>({
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
        <WihView style={styles.container}>
            <WihRefreshableScrollView onRefresh={[refresh]} style={{height: "100%"}}>
                <WihTitle style={styles.title}>{t(Labels.titles.welcome)}!</WihTitle>

                {overviews.map((o, i) => <DailyOverviewCard key={i} overview={o} />)}
            </WihRefreshableScrollView>
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
