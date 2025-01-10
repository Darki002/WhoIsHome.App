import {useSession} from "@/components/auth/context";
import {WihAvatar} from "@/components/WihAvatar";
import {WihButton} from "@/components/input/WihButton";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {Dimensions, StyleSheet, ViewStyle} from 'react-native';
import {UserOverview, UserOverviewDto} from "@/constants/WihTypes/WihTypes";
import useWihApiInterval from "@/hooks/wihApi/useWihApiInterval";
import WihEventList from "@/components/wihEvent/WihEventList";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import WihLoading from "@/components/WihLoading";

const TIME = 5 * 60 * 1000;

const Profile = () => {
    const {t} = useTranslation();
    const {signOut} = useSession();
    const user = useWihApi<User | null>({
        endpoint: Endpoints.user.me,
        method: "GET",
    });
    const response = useWihApiInterval<UserOverviewDto | null>({
        time: TIME,
        endpoint: Endpoints.userOverview.url,
        method: "GET",
    });

    const dim = Dimensions.get("screen");
    const viewStyle: ViewStyle = {
        paddingLeft: dim.width / 12,
        paddingTop: dim.height / 16
    }
    const avatarStyle = {
        marginRight: dim.width / 20
    }
    const textStyle = {
        fontSize: dim.fontScale * 24
    }

    if (!response || !user) {
        return (
            <WihView center="full">
                <WihLoading/>
            </WihView>
        )
    }

    if (user.hasError) {
        console.error(user.error);
        return <WihTitle>{t(Labels.errors.generic)}</WihTitle>
    }

    if (response.hasError || !response.response) {
        console.error(response.error);
        return <WihTitle>{t(Labels.errors.generic)}</WihTitle>
    }

    const userOverview = new UserOverview(response.response);
    const userName = user.response?.userName ?? "";
    return (
        <WihView style={styles.container}>
            <WihView style={styles.profileHeader}>
                <WihView style={styles.userInfo}>
                    <WihAvatar name={userName} size={dim.scale * 12} style={styles.avatar}/>
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
                    <WihView style={styles.eventSection}>
                        <WihTitle style={styles.sectionTitle}>{t(Labels.sections.today)}</WihTitle>
                        <WihEventList events={userOverview.Today}/>
                    </WihView>
                )}

                {/* This Week */}
                {userOverview.ThisWeek.length > 0 && (
                    <WihView style={styles.eventSection}>
                        <WihTitle style={styles.sectionTitle}>{t(Labels.sections.thisWeek)}</WihTitle>
                        <WihEventList events={userOverview.ThisWeek}/>
                    </WihView>
                )}

                {/* Future Events */}
                {userOverview.FutureEvents.length > 0 && (
                    <WihView style={styles.eventSection}>
                        <WihTitle style={styles.sectionTitle}>{t(Labels.sections.other)}</WihTitle>
                        <WihEventList events={userOverview.FutureEvents}/>
                    </WihView>
                )}
            </WihView>
        </WihView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
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
    },
    eventSection: {
        marginBottom: 20
    },
    sectionTitle: {
        marginBottom: 10
    },
});

export default Profile;