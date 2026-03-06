import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihComponents/view/WihView";
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/OverviewTypes";
import WihEventList from "@/components/WihComponents/layout/event/WihEventList";
import React, {useCallback, useEffect} from "react";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import {WihText} from "@/components/WihComponents/display/WihText";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";

export default function UserView() {
    const {id} = useLocalSearchParams<{ id: string }>();
    return <WihApiFocus Component={UserViewOverviewComponent} endpoint={Endpoints.user.withId(id)} method="GET"/>
}

function UserViewComponent({user, overviewResponse, overviewRefresh}: {
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
                    overview.Events.length < 1 && (
                        <WihView center="full">
                            <WihText>{t(Labels.errors.noEvents)}</WihText>
                        </WihView>
                    )
                }

                <WihView style={styles.eventLists}>
                    {overview.Events.length > 0 && (
                        <WihEventList events={overview.Events}/>
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

function UserViewOverviewComponent({response}: WihApiFocusComponentParams<User>) {
    const {id} = useLocalSearchParams<{ id: string }>();

    const user = response;
    const component = useCallback(({response, refresh}: WihApiFocusComponentParams<UserOverviewDto>) => (
        <UserViewComponent user={user} overviewResponse={response} overviewRefresh={refresh} />
    ), [user]);

    return <WihApiFocus Component={component} endpoint={Endpoints.quarries.userOverview.withId(id)} method="GET" />
}