import {useSession} from "@/components/appContexts/AuthContext";
import {WihAvatar} from "@/components/WihComponents/icon/WihAvatar";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {WihText} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {Dimensions, StyleSheet} from 'react-native';
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/OverviewTypes";
import WihEventList from "@/components/WihComponents/layout/event/WihEventList";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {WihRefreshableScrollView} from "@/components/WihComponents/view/WihRefreshableScrollView";
import {useWihUser} from "@/components/appContexts/WihUserContext";
import {WihApiFocus, WihApiFocusComponentParams} from "@/components/framework/wihApi/WihApiFocus";
import {Endpoints} from "@/constants/endpoints";

const Profile = ({response, refresh}: WihApiFocusComponentParams<UserOverviewDto>) => {
    const {t} = useTranslation();
    const {signOut} = useSession();
    const {user} = useWihUser();

    const dim = Dimensions.get("screen");

    const userOverview = new UserOverview(response);
    const userName = user?.userName ?? "";

    return (
        <WihView style={{flex: 1}}>
            <WihRefreshableScrollView onRefresh={refresh} style={{height: "100%"}}>
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

                    <WihView style={styles.eventLists}>
                        <WihEventList events={userOverview.Events}/>
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

export default function () {
    return <WihApiFocus endpoint={Endpoints.quarries.userOverview.url} method="GET" Component={Profile} />
}