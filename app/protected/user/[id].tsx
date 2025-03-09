import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihComponents/view/WihView";
import useWihApiEffect from "@/hooks/wihApi/useWihApiEffect";
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/WihTypes";
import {WihLoadingView} from "@/components/WihComponents/feedback/WihLoading";
import WihEventList from "@/components/WihComponents/layout/event/WihEventList";
import React, {useEffect} from "react";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {WihCollapsible} from "@/components/WihComponents/view/WihCollapsible";
import {StyleSheet} from "react-native";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/focus/WihApiFocus";

const EVENT_COUNT_THRESHOLD = 4;

export default function UserView() {
    const {id} = useLocalSearchParams<{ id: string }>();

    return WihApiFocus({
        endpoint: Endpoints.userOverview.withId(id),
        method: "GET",
        Component: UserViewComponent
    })
}

function UserViewComponent({response, refresh} : WihApiFocusComponentParams<UserOverviewDto>) {
    const {id} = useLocalSearchParams<{ id: string }>();
    const {t} = useTranslation();
    const navigation = useNavigation();
    
    const [user, userRefresh] = useWihApiEffect<User>({
        endpoint: Endpoints.user.withId(id),
        method: "GET",
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

    if (!user) {
        return <WihLoadingView/>
    }

    if (!user.isValid()) {
        return <WihErrorView error={user} refresh={userRefresh} />
    }

    const overview = new UserOverview(response);
    return (
        <WihView style={styles.container}>
            <WihRefreshableScrollView onRefresh={refresh}>
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