import { WihTitle} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Dimensions, StyleSheet} from "react-native";
import DailyOverviewScreen from "@/components/pages/Home/DailyOverviewScreen";
import {useState} from "react";
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import WeeklyReportScreen from "@/components/pages/Home/WeeklyReportScreen";

export default function Index() {
    const {t} = useTranslation();
    const theme = useWihTheme();

    const layout = Dimensions.get('window');
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'daily', title: t(Labels.tabs.daily) },
        { key: 'weekly', title: t(Labels.tabs.weekly) },
    ]);

    const renderScene = SceneMap({
        daily: DailyOverviewScreen,
        weekly: WeeklyReportScreen,
    });

    return (
        <WihView style={styles.container}>
            <WihTitle style={styles.title}>{t(Labels.titles.welcome)}!</WihTitle>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: theme.primary }}
                        style={{ backgroundColor: theme.background }}
                        activeColor={theme.text}
                        inactiveColor={theme.textSecondary}
                        tabStyle={{ paddingVertical: 8 }}
                    />
                )}
            />

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
});
