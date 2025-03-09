import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihComponents/view/WihView";
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/WihTypes";
import WihEventList from "@/components/WihComponents/layout/event/WihEventList";
import React, {useEffect} from "react";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {WihCollapsible} from "@/components/WihComponents/view/WihCollapsible";
import {StyleSheet} from "react-native";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";

const EVENT_COUNT_THRESHOLD = 4;

function UserViewComponent({user, overviewResponse, overviewRefresh} : {
    user: User;
    overviewResponse: UserOverviewDto;
    overviewRefresh: () => void;
}) {
    const {t} = useTranslation();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({title: user.userName});
    }, [user]);

    const overview = new UserOverview(overviewResponse);

    return (
        <WihView style={styles.container}>
            <WihRefreshableScrollView onRefresh={overviewRefresh}>
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

export default function UserView() {
    const {id} = useLocalSearchParams<{ id: string }>();

    return WihApiFocus({
        endpoint: Endpoints.user.withId(id),
        method: "GET",
        Component: UserViewOverviewComponent
    })
}

function UserViewOverviewComponent({response} : WihApiFocusComponentParams<User>) {
    const {id} = useLocalSearchParams<{ id: string }>();

    const user = response;

    return WihApiFocus({
        endpoint: Endpoints.userOverview.withId(id),
        method: "GET",
        Component: ({response, refresh} : WihApiFocusComponentParams<UserOverviewDto>) => UserViewComponent({
            user: user,
            overviewResponse: response,
            overviewRefresh: refresh})
    })
}