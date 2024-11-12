import {useLocalSearchParams} from "expo-router";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import useWihApi from "@/hooks/useWihApi";
import {User, UserOverview} from "@/constants/WihTypes";
import WihLoading from "@/components/WihLoading";
import WihEventList from "@/components/wihEvent/WihEventList";

export default function PersonView() {
    const { id } = useLocalSearchParams();
    const response = useWihApi<UserOverview>({
        endpoint: `PersonOverview/${id}`,
        method: "GET"
    });
    const user = useWihApi<User>({
        endpoint: `Auth/${id}`,
        method: "GET"
    });

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