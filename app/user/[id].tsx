import {useLocalSearchParams} from "expo-router";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";

export default function PersonView() {
    const { id } = useLocalSearchParams();

    return (
        <WihView>
            <WihText>{id}</WihText>
        </WihView>
    )
}