import {WihTitle} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";
import WihLoading from "@/components/WihComponents/feedback/WihLoading";
import {DailyOverviewCard} from "@/components/pages/Home/DailyOverviewCard";
import {DailyOverview, DailyOverviewDto} from "@/constants/WihTypes/DailyOverview";
import {StyleSheet} from "react-native";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
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

    if (!response.isValid() || !response.data) {
        return <WihErrorView response={response} refresh={refresh} />
    }

    const overviews = response.data.map(r => new DailyOverview(r));

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
