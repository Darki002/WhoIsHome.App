import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/input/WihButton";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";

const Create = () => {
    const {t} = useTranslation();
    const router = useRouter();

    const routeToOneTime = () => {
        router.push("/protected/createFlow/oneTimeEventFlow");
    }

    const routeToRepeated = () => {
        router.push("/protected/createFlow/repeatedEventFlow");
    }

    return (
        <WihView center="full">
            <WihTitle>{t(Labels.titles.eventCreator)}</WihTitle>

            <WihText>{t(Labels.descriptions.eventCreator)}</WihText>

            <WihView style={styles.container}>
                <WihButton onPress={routeToOneTime}>{t(Labels.oneTimeEvent)}</WihButton>
                <WihText>{t(Labels.descriptions.oneTimeEvent)}</WihText>
            </WihView>

            <WihView style={styles.container}>
                <WihButton onPress={routeToRepeated}>{t(Labels.repeatedEvent)}</WihButton>
                <WihText>{t(Labels.descriptions.repeatedEvent)}</WihText>
            </WihView>

        </WihView>
    );
}

const styles = StyleSheet.create({
    subTitles: {
        fontWeight: "bold"
    },
    container: {
        display: "flex",
        flexDirection: "column",
        marginTop: 20
    }
});

export default Create;