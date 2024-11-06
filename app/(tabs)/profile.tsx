import {useSession} from "@/components/auth/context";
import { WihAvatar } from "@/components/WihAvatar";
import { WihButton } from "@/components/WihButton";
import { WihText, WihTitle } from "@/components/WihText";
import WihView from "@/components/WihView";
import { Dimensions, StyleSheet, ViewStyle } from 'react-native';
import {wihFetch, WihResponse} from "@/components/api/whoIsHomeApi";
import {useEffect, useState} from "react";
import {Redirect} from "expo-router";
import {WihEventCard} from "@/components/WihEventCard";
import {Tokens, User, WihEvent} from "@/constants/WihTypes";

const TIME = 5 * 60 * 1000;

type Overview = {
    user: User;
    today: WihEvent[];
    thisWeek: WihEvent[];
    futureEvents: WihEvent[];
}

const Profile = () => {
    const { signOut, session, onNewSession } = useSession();
    const [response, setResponse] = useState<WihResponse<Overview | null> | null>(null);

    useEffect(() => {
        // Refresh every other Minute
        const id = setInterval(() => {
            if(session){
                // Fire and Forget, we do not care. Want to show the loading page
                // Will set the response later and rerender
                // noinspection JSIgnoredPromiseFromCall
                loadData(session);
            }
        }, TIME);
        return () => clearInterval(id);
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
            onNewSession(tokens);
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

    const height = dim.height / 25;
    const overview = response.response;

    const today = getEventView("Today", overview?.today, height);
    const thisWeek = getEventView("This Week", overview?.thisWeek, height);
    const futureEvents = getEventView("Other", overview?.futureEvents, height);

    const userName = response.response?.user.userName ?? "";
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

async function getEvents(session: Tokens, onNewTokens: (newTokens: Tokens | null) => void) : Promise<WihResponse<Overview | null>> {
    return await wihFetch<Overview>({
        endpoint: "PersonOverview",
        method: "GET",
        tokens: session,
        onNewTokens
    });
}

function getEventView(title : string, events : WihEvent[] | undefined, height : number){
    if(!events || events.length < 1){
        return null;
    }

    return(
        <>
            <WihTitle style={{ marginTop: height }}>{title}</WihTitle>
            {
                events.map(event => (<WihEventCard event={event} />))
            }
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