import {WihText} from "@/components/WihText";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/input/WihButton";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

const Index = () => {
    const {t} = useTranslation();
    const router = useRouter();

    return (
        <WihView center="full">
            <WihText>{t(Labels.titles.eventCreator)}</WihText>

            <WihButton onPress={() => router.push("/protected/(tabs)/create/oneTimeEventFlow")}>{t(Labels.oneTimeEvent)}</WihButton>
            <WihButton onPress={() => router.push("/protected/(tabs)/create/repeatedEventFlow")}>{t(Labels.repeatedEvent)}</WihButton>
        </WihView>
    );
}

export default Index;