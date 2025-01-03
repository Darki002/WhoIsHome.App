import {WihText} from "@/components/WihText";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/input/WihButton";
import {useRouter} from "expo-router";

const Index = () => {
    const router = useRouter();

    return (
        <WihView center="full">
            <WihText>Hello Create!</WihText>

            <WihButton onPress={() => router.push("/protected/(tabs)/create/oneTimeEventFlow")}>One Time</WihButton>
            <WihButton onPress={() => router.push("/protected/(tabs)/create/repeatedEventFlow")}>Repeated</WihButton>
        </WihView>
    );
}

export default Index;