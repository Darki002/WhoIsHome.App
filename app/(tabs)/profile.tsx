import {Tokens, useSession} from "@/components/auth/context";
import { WihAvatar } from "@/components/WihAvatar";
import { WihButton } from "@/components/WihButton";
import { WihText, WihTitle } from "@/components/WihText";
import WihView from "@/components/WihView";
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import {TokensProps, wihFetch, WihResponse} from "@/components/api/whoIsHomeApi";
import {useEffect, useState} from "react";
import {Redirect} from "expo-router";
import {WihEventCard} from "@/components/WihEventCard";

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
    user: User;
    today: Event[];
    thisWeek: Event[];
    futureEvents: Event[];
}

const Profile = () => {
    const { signOut, session, onNewSession } = useSession();
    const [response, setResponse] = useState<WihResponse<Overview | null> | null>(null);

    useEffect(() => {
        if(session){
            // Fire and Forget, we do not care. Want to show the loading page
            // Will set the response later and rerender
            // noinspection JSIgnoredPromiseFromCall
            loadData(session);
        }
    }, [session]);

    if(!session) {
        console.error("Session is not set.");
        return <WihTitle>Oops, Error occurred...</WihTitle>
    }

    async function loadData(tokens : Tokens) {
        const res = await getEvents(tokens, tokens => {
            if(!tokens){
                console.warn("New Tokens but empty");
                return;
            }
            onNewSession({
                jwtToken: tokens?.Token,
                refreshToken: tokens?.RefreshToken
            })
        });
        setResponse(res);
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

    if(!response){
        return (
            <>
                <WihView style={[viewStyle, styles.view]}>
                    <WihAvatar name="" size={dim.scale * 14} style={avatarStyle} />
                    <WihText style={[styles.text, textStyle]}>Loading...</WihText>
                    <WihButton onPress={() => {}}>Logout</WihButton>
                </WihView >
                <WihView center="horizontal">
                    <WihTitle style={{ marginTop: dim.height / 20 }}>Your Events</WihTitle>
                    <WihText>Loading...</WihText>
                </WihView>
            </>
        )
    }

    if(response.hasError) {
        if(response.status == 401) {
            return <Redirect href="/auth/login" />
        }
        console.error(response.error);
        return <WihTitle>Oops, Error occurred: {response.error}</WihTitle>
    }

    const today = response.response?.today.length == 0 ? null : (
        <>
            <WihTitle style={{ marginTop: dim.height / 25 }}>Today</WihTitle>
            {
                response.response?.today
                    .map(event => (<WihEventCard event={event} />))
            }
        </>
    );

    const thisWeek = response.response?.thisWeek.length == 0 ? null : (
        <>
            <WihTitle style={{ marginTop: dim.height / 25 }}>This Week</WihTitle>
            {
                response.response?.today
                .map(event => (<WihEventCard event={event} />))
            }
        </>
    );

    const futureEvents = response.response?.futureEvents.length == 0 ? null : (
        <>
            <WihTitle style={{ marginTop: dim.height / 25 }}>Other</WihTitle>
            {
                response.response?.today
                    .map(event => (<WihEventCard event={event} />))
            }
        </>
    );

    const userName = response.response?.user.UserName ?? "";
    return (
        <>
            <WihView style={[viewStyle, styles.view]}>
                <WihAvatar name={userName} size={dim.scale * 14} style={avatarStyle} />
                <WihText style={[styles.text, textStyle]}>{userName}</WihText>
                <WihButton onPress={() => signOut()}>Logout</WihButton>
            </WihView >
            <WihView center="horizontal">
                <WihTitle style={{ marginTop: dim.height / 20 }}>Your Events</WihTitle>
                {today}
                {thisWeek}
                {futureEvents}
            </WihView>
        </>
    );
}

async function getEvents(session: Tokens, onNewTokens: (newTokens: TokensProps | null) => void) : Promise<WihResponse<Overview | null>> {
    return await wihFetch<Overview>({
        endpoint: "PersonOverview",
        method: "GET",
        tokens: {
            Token: session.jwtToken!,
            RefreshToken: session.refreshToken!
        },
        onNewTokens: onNewTokens
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