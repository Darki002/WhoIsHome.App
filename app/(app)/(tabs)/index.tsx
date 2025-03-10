import {WihTitle} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";
import {DailyOverviewCard} from "@/components/pages/Home/DailyOverviewCard";
import {DailyOverview, DailyOverviewDto} from "@/constants/WihTypes/DailyOverview";
import {StyleSheet} from "react-native";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";

export default function Index() {
    return WihApiFocus({
        endpoint: Endpoints.dailyOverview,
        method: "GET",
        Component: IndexComponent
    })
}

function IndexComponent({response, refresh} : WihApiFocusComponentParams<DailyOverviewDto[]>) {
    const {t} = useTranslation();
    const overviews = response.map(r => new DailyOverview(r));

    return (
        <WihView style={styles.container}>
            <WihRefreshableScrollView onRefresh={refresh} style={{height: "100%"}}>
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
