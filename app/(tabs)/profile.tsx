import {Tokens, useSession} from "@/components/auth/context";
import { WihAvatar } from "@/components/WihAvatar";
import { WihButton } from "@/components/WihButton";
import { WihText, WihTitle } from "@/components/WihText";
import WihView from "@/components/WihView";
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import {wihFetch, WihResponse} from "@/components/api/whoIsHomeApi";

type User = {
    Id: number;
    UserName: string;
    Email: string;
}

type Event = {
    Id: number;
    Title: string;
    Date: Date;
    StartTime: Date;
    EndTime: Date;
    EventType: string;
}

type Overview = {
    User: User;
    Today: Event[];
    ThisWeek: Event[];
    FutureEvents: Event[];
}

const Profile = async () => {
    const { signOut, session } = useSession();

    if(!session) {
        return <WihTitle>Oops, Error occurred...</WihTitle>
    }

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

    const eventResponse = await getEvents(session);
    if(eventResponse.hasError) {
        return <WihTitle>Oops, Error occurred...</WihTitle>
    }

    const userName = eventResponse.response!.User.UserName
    return (
        <>
            <WihView style={[viewStyle, styles.view]}>
                <WihAvatar name={userName} size={dim.scale * 14} style={avatarStyle} />
                <WihText style={[styles.text, textStyle]}>{userName}</WihText>
                <WihButton onPress={() => signOut()}>Logout</WihButton>
            </WihView >
            <WihView center="horizontal">
                <WihTitle style={{ marginTop: dim.height / 20 }}>Your Events</WihTitle>
                {/* Collabsalbes for Today, this week, future */}
                {/* OR all Events listed in albathatic order */}
                {/* OR custom sort: name, date, created */}
                <WihText>Loading...</WihText>
            </WihView>
        </>
    );
}

async function getUser(session : Tokens) : Promise<WihResponse<User | null>> {
    return await wihFetch<User>({
        endpoint: "Auth/Me",
        method: "GET",
        tokens: {
            Token: session.jwtToken!,
            RefreshToken: session.refreshToken!
        }
    });
}

async function getEvents(session: Tokens) : Promise<WihResponse<Overview | null>> {
    return await wihFetch<Overview>({
        endpoint: "PersonOverview/Me",
        method: "GET",
        tokens: {
            Token: session.jwtToken!,
            RefreshToken: session.refreshToken!
        }
    });
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