import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihComponents/view/WihView";
import useWihApiEffect from "@/hooks/wihApi/useWihApiEffect";
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/WihTypes";
import WihLoading from "@/components/WihComponents/feedback/WihLoading";
import WihEventList from "@/components/WihComponents/layout/event/WihEventList";
import React, {useEffect} from "react";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {WihCollapsible} from "@/components/WihComponents/view/WihCollapsible";
import {StyleSheet} from "react-native";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";

const EVENT_COUNT_THRESHOLD = 4;

export default function UserView() {
    const {t} = useTranslation();
    const {id} = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const [user, userRefresh] = useWihApiEffect<User>({
        endpoint: Endpoints.user.withId(id),
        method: "GET",
    });
    const [response, refresh] = useWihApiFocus<UserOverviewDto>({
        endpoint: Endpoints.userOverview.withId(id),
        method: "GET"
    });

    useEffect(() => {
        if (!user) {
            navigation.setOptions({title: t(Labels.headers.unknown)});
            return;
        }
        if (!user.isValid()) {
            navigation.setOptions({title: t(Labels.errors.header)});
            return;
        }
        navigation.setOptions({title: user.data?.userName});
    }, [user]);

    if (!response || !user) {
        return <WihLoading/>
    }

    if (!response.isValid()) {
        return <WihErrorView response={response!} refresh={refresh} />
    }

    if (!user.isValid()) {
        return <WihErrorView response={user} refresh={userRefresh} />
    }

    const overview = new UserOverview(response.data!);
    return (
        <WihView style={styles.container}>
            <WihRefreshableScrollView onRefresh={[refresh, userRefresh]}>
                {
                    overview.Today.length + overview.ThisWeek.length + overview.FutureEvents.length < 1 && (
                        <WihView center="full">
                            <WihText>{t(Labels.errors.noEvents)}</WihText>
                        </WihView>
                    )
                }

                {/* Event Lists */}
                <WihView style={styles.eventLists}>
                    {/* Today */}
                    {overview.Today.length > 0 && (
                        <WihCollapsible
                            title={t(Labels.sections.today)}
                            isDefaultOpen={overview.Today.length < EVENT_COUNT_THRESHOLD}
                        >
                            <WihEventList events={overview.Today}/>
                        </WihCollapsible>
                    )}

                    {/* This Week */}
                    {overview.ThisWeek.length > 0 && (
                        <WihCollapsible
                            title={t(Labels.sections.thisWeek)}
                            isDefaultOpen={overview.ThisWeek.length < EVENT_COUNT_THRESHOLD}
                        >
                            <WihEventList events={overview.ThisWeek}/>
                        </WihCollapsible>
                    )}

                    {/* Future Events */}
                    {overview.FutureEvents.length > 0 && (
                        <WihCollapsible
                            title={t(Labels.sections.other)}
                            isDefaultOpen={overview.FutureEvents.length < EVENT_COUNT_THRESHOLD}
                        >
                            <WihEventList events={overview.FutureEvents}/>
                        </WihCollapsible>
                    )}
                </WihView>
            </WihRefreshableScrollView>
        </WihView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    eventLists: {
        flex: 1
    }
});