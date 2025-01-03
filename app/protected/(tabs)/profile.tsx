import {useSession} from "@/components/auth/context";
import {WihAvatar} from "@/components/WihAvatar";
import {WihButton} from "@/components/input/WihButton";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {Dimensions, StyleSheet, ViewStyle} from 'react-native';
import {Redirect} from "expo-router";
import {UserOverview} from "@/constants/WihTypes/WihTypes";
import useWihApiInterval from "@/hooks/wihApi/useWihApiInterval";
import WihEventList from "@/components/wihEvent/WihEventList";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {User} from "@/constants/WihTypes/User";

const TIME = 5 * 60 * 1000;

const Profile = () => {
    const {signOut} = useSession();
    const user = useWihApi<User | null>({
        endpoint: "User/Me",
        method: "GET",
    });
    const response = useWihApiInterval<UserOverview | null>({
        time: TIME,
        endpoint: "UserOverview",
        method: "GET",
    });

    const dim = Dimensions.get("screen");
    const viewStyle: ViewStyle = {
        marginLeft: dim.width / 12,
        marginTop: dim.height / 16
    }
    const avatarStyle = {
        marginRight: dim.width / 20
    }
    const textStyle = {
        fontSize: dim.fontScale * 24
    }

    if (!response || !user) {
        return (
            <WihView>
                <WihView style={[viewStyle, styles.view]}>
                    <WihAvatar name="" size={dim.scale * 14} style={avatarStyle}/>
                    <WihText style={[styles.text, textStyle]}>Loading...</WihText>
                    <WihButton onPress={() => {
                    }}>Logout</WihButton>
                </WihView>
                <WihView center="horizontal">
                    <WihTitle style={{marginTop: dim.height / 20}}>Your Events</WihTitle>
                    <WihText>Loading...</WihText>
                </WihView>
            </WihView>
        )
    }

    if (user.hasError) {
        if (user.status == 401) {
            return <Redirect href="/auth/login"/>
        }
        console.error(user.error);
        return <WihTitle>Oops, Error occurred: {user.error}</WihTitle>
    }

    if (response.hasError) {
        if (response.status == 401) {
            return <Redirect href="/auth/login"/>
        }
        console.error(response.error);
        return <WihTitle>Oops, Error occurred: {response.error}</WihTitle>
    }

    const overview = response.response;
    const userName = user.response?.userName ?? "";
    return (
        <>
            <WihView style={[viewStyle, styles.view]}>
                <WihAvatar name={userName} size={dim.scale * 14} style={avatarStyle}/>
                <WihText style={[styles.text, textStyle]}>{userName}</WihText>
                <WihButton onPress={() => signOut()}>Logout</WihButton>
            </WihView>
            <WihView center="horizontal">
                <WihTitle style={{marginTop: dim.height / 20}}>Your Events</WihTitle>
                <WihEventList events={overview?.today} title="Today"/>
                <WihEventList events={overview?.thisWeek} title="This Week"/>
                <WihEventList events={overview?.futureEvents} title="Other"/>
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

// noinspection JSUnusedGlobalSymbols
export default Profile;