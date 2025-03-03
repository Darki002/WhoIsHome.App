import {useSession} from "@/components/appContexts/AuthContext";
import {WihAvatar} from "@/components/WihComponents/icon/WihAvatar";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {Dimensions, StyleSheet} from 'react-native';
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/WihTypes";
import WihEventList from "@/components/WihComponents/layout/event/WihEventList";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import WihLoading from "@/components/WihComponents/feedback/WihLoading";
import {WihCollapsible} from "@/components/WihComponents/view/WihCollapsible";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";

const EVENT_COUNT_THRESHOLD = 4;

const Profile = () => {
    const {t} = useTranslation();
    const {signOut} = useSession();
    const [user, userRefresh] = useWihApi<User>({
        endpoint: Endpoints.user.me,
        method: "GET",
    });
    const [response, responseRefresh] = useWihApiFocus<UserOverviewDto>({
        endpoint: Endpoints.userOverview.url,
        method: "GET",
    });

    const dim = Dimensions.get("screen");

    if (!response || !user) {
        return (
            <WihView center="full">
                <WihLoading/>
            </WihView>
        )
    }

    if (!user.isValid()) {
        return <WihErrorView response={user} refresh={userRefresh} />
    }

    if (!response.isValid() || !response.data) {
        return <WihErrorView response={response} refresh={responseRefresh} />
    }

    const userOverview = new UserOverview(response.data);
    const userName = user.data?.userName ?? "";
    return (
        <WihView style={{flex: 1}}>
            <WihRefreshableScrollView onRefresh={[userRefresh, responseRefresh]} style={{height: "100%"}}>
                <WihView style={styles.container}>
                    <WihView style={styles.profileHeader}>
                        <WihView style={styles.userInfo}>
                            <WihAvatar name={userName} size={dim.scale * 14} style={styles.avatar}/>
                            <WihText style={styles.userName}>{userName}</WihText>
                        </WihView>
                        <WihButton onPress={signOut}>
                            {t(Labels.actions.logout)}
                        </WihButton>
                    </WihView>

                    {/* Event Lists */}
                    <WihView style={styles.eventLists}>
                        {/* Today */}
                        {userOverview.Today.length > 0 && (
                            <WihCollapsible
                                title={t(Labels.sections.today)}
                                isDefaultOpen={userOverview.Today.length < EVENT_COUNT_THRESHOLD}
                            >
                                <WihEventList events={userOverview.Today}/>
                            </WihCollapsible>
                        )}

                        {/* This Week */}
                        {userOverview.ThisWeek.length > 0 && (
                            <WihCollapsible
                                title={t(Labels.sections.thisWeek)}
                                isDefaultOpen={userOverview.ThisWeek.length < EVENT_COUNT_THRESHOLD}
                            >
                                <WihEventList events={userOverview.ThisWeek}/>
                            </WihCollapsible>
                        )}

                        {/* Future Events */}
                        {userOverview.FutureEvents.length > 0 && (
                            <WihCollapsible
                                title={t(Labels.sections.other)}
                                isDefaultOpen={userOverview.FutureEvents.length < EVENT_COUNT_THRESHOLD}
                            >
                                <WihEventList events={userOverview.FutureEvents}/>
                            </WihCollapsible>
                        )}
                    </WihView>
                </WihView>
            </WihRefreshableScrollView>
        </WihView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
        marginTop: 20
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 35,
        paddingHorizontal: 10
    },
    avatar: {
        marginRight: 10
    },
    userInfo: {
        flex: 1,
        flexDirection: "row"
    },
    userName: {
        textAlignVertical: "center",
        fontSize: 18,
        fontWeight: "bold"
    },
    eventLists: {
        flex: 1
    }
});

export default Profile;