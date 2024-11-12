import {useLocalSearchParams, useNavigation} from "expo-router";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import useWihApi from "@/hooks/useWihApi";
import {UserOverview} from "@/constants/WihTypes";
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

    useEffect(() => {
        if(!response){
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if(response.hasError) {
            navigation.setOptions({title: "Error"});
            return;
        }
        navigation.setOptions({title: response.response?.user.userName});
    }, [response]);

    if(!response){
        return <WihLoading />
    }

    if(response.hasError){
        return (
            <WihView center="full">
                <WihText>Oops, Error occurred, while trying to get user {id}.</WihText>
                <WihText>{response.error}</WihText>
            </WihView>
        )
    }

    const overview = response.response;
    return (
        <WihView>
            <WihTitle>{response.response!.user.userName}'s Events</WihTitle>

            <WihEventList events={overview?.today} title="Today" />
            <WihEventList events={overview?.thisWeek} title="This Week" />
            <WihEventList events={overview?.futureEvents} title="Other" />
        </WihView>
    )
}