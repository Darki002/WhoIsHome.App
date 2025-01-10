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
                <WihLoading />
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

    const overview = new UserOverview(response.response);
    const userName = user.response?.userName ?? "";
    return (
        <>
            <WihView style={[viewStyle, styles.view]}>
                <WihAvatar name={userName} size={dim.scale * 14} style={avatarStyle}/>
                <WihText style={[styles.text, textStyle]}>{userName}</WihText>
                <WihButton onPress={() => signOut()}>{t(Labels.actions.logout)}</WihButton>
            </WihView>
            <WihView center="horizontal">
                <WihTitle style={{marginTop: dim.height / 20}}>Your Events</WihTitle>
                <WihEventList events={overview?.Today} title={t(Labels.subTitles.today)}/>
                <WihEventList events={overview?.ThisWeek} title={t(Labels.subTitles.thisWeek)}/>
                <WihEventList events={overview?.FutureEvents} title={t(Labels.subTitles.other)}/>
            </WihView>
        </>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        fontWeight: "bold"
    }
})

export default Profile;