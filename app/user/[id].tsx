import {useLocalSearchParams} from "expo-router";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import useWihApi from "@/hooks/useWihApi";
import {User, UserOverview} from "@/constants/WihTypes";
import WihLoading from "@/components/WihLoading";

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

    return (
        <WihView>
            <WihTitle>{user.response!.userName}</WihTitle>
        </WihView>
    )
}