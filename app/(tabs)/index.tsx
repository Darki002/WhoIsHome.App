import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import useWihApiInterval from "@/hooks/useWihApiInterval";
import {Pressable} from "react-native";
import {router} from "expo-router";

const TIME = 5 * 60 * 1000;

type DailyOverview = {
    user: {
        id: number;
        username: string;
    };
    isAtHome: boolean;
    dinnerTime: string | null;
}

export default function Index() {
    const response = useWihApiInterval<DailyOverview[]>({
        time: TIME,
        method: "GET",
        endpoint: "DailyOverview"
    });

    if(!response){
        return (
            <WihView center="full">
                <WihTitle>Loading...</WihTitle>
            </WihView>
        )
    }

    if(response.hasError) {
        return (
            <WihView center="full">
                <WihTitle>Oops, unexpected Error!</WihTitle>
            </WihView>
        )
    }

  return (
    <WihView center="horizontal">
        <WihTitle style={{fontSize: 25}}>Welcome!</WihTitle>
        {response.response!.map((o, i) => DailyOverview(o, i))}
    </WihView >
  );
}

function DailyOverview(overview : DailyOverview, key : number) {
    return(
        <Pressable onPress={() => router.push(`/user/${overview.user.id}`)} key={key}>
            <WihView center="horizontal">
                <WihTitle>{overview.user.username}</WihTitle>
                <WihText>Is at home: {overview.isAtHome ? "yes" : "no"}</WihText>
                {overview.dinnerTime ? <WihText>{overview.dinnerTime}</WihText> : null}
            </WihView>
        </Pressable>
    )
}
