import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import useWihApi from "@/hooks/useWihApi";
import {User, UserOverview} from "@/constants/WihTypes";
import WihLoading from "@/components/WihLoading";
import WihEventList from "@/components/wihEvent/WihEventList";
import {useEffect} from "react";

export default function UserView() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const response = useWihApi<UserOverview>({
        endpoint: `UserOverview/${id}`,
        method: "GET"
    });
    const user = useWihApi<User>({
        endpoint: `Auth/${id}`,
        method: "GET"
    });

    useEffect(() => {
        if(!user){
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if(user.hasError) {
            navigation.setOptions({title: "Error"});
            return;
        }
        navigation.setOptions({title: user.response?.userName});
    }, [user]);

    if(!response || !user){
        return <WihLoading />
    }

    if(response.hasError || user.hasError){
        return (
            <WihView center="full">
                <WihText>Oops, Error occurred, while trying to get user {id}</WihText>
            </WihView>
        )
    }

    const overview = response.response;
    return (
        <WihView>
            <WihTitle>{user.response!.userName}'s Events</WihTitle>

            <WihEventList events={overview?.today} title="Today" />
            <WihEventList events={overview?.thisWeek} title="This Week" />
            <WihEventList events={overview?.futureEvents} title="Other" />
        </WihView>
    )
}