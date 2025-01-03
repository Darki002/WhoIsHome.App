import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {UserOverview} from "@/constants/WihTypes/WihTypes";
import WihLoading from "@/components/WihLoading";
import WihEventList from "@/components/wihEvent/WihEventList";
import {useEffect} from "react";
import useWihApiFocus from "@/hooks/wihApi/useWihApiFocus";
import {User} from "@/constants/WihTypes/User";

export default function UserView() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const navigation = useNavigation();
    const user = useWihApi<User | null>({
        endpoint: `User/${id}`,
        method: "GET",
    });
    const response = useWihApiFocus<UserOverview>({
        endpoint: `UserOverview/${id}`,
        method: "GET"
    });

    useEffect(() => {
        if (!user) {
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if (user.hasError) {
            navigation.setOptions({title: "Error"});
            return;
        }
        navigation.setOptions({title: user.response?.userName});
    }, [user]);

    if (!response || !user) {
        return <WihLoading/>
    }

    if (response.hasError) {
        return (
            <WihView center="full">
                <WihText>Oops, Error occurred, while trying to get user {id}.</WihText>
                <WihText>{response.error}</WihText>
            </WihView>
        )
    }

    if (user.hasError) {
        return (
            <WihView center="full">
                <WihText>Oops, Error occurred, while trying to get user {id}.</WihText>
                <WihText>{user.error}</WihText>
            </WihView>
        )
    }

    const overview = response.response;
    console.log(overview);
    return (
        <WihView center="horizontal">
            <WihTitle>{user.response!.userName}'s Events</WihTitle>

            <WihEventList events={overview?.today} title="Today"/>
            <WihEventList events={overview?.thisWeek} title="This Week"/>
            <WihEventList events={overview?.futureEvents} title="Other"/>
        </WihView>
    )
}