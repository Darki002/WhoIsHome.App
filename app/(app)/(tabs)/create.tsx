import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import WihDivider from "@/components/WihComponents/layout/WihDivider";
import WihCard from "@/components/WihComponents/layout/WihCard";

const Create = () => {
    const {t} = useTranslation();
    const router = useRouter();

    const routeToOneTime = () => {
        router.push("/(app)/createFlow/oneTimeEventFlow");
    }

    const routeToRepeated = () => {
        router.push("/(app)/createFlow/repeatedEventFlow");
    }

    // TODO: remove flow, and make it one scrollable page. Event creation is now unified
    return (
        <WihView center="full" style={styles.mainContainer}>
            <WihTitle>{t(Labels.titles.eventCreator)}</WihTitle>
            <WihText style={styles.description}>{t(Labels.descriptions.eventCreator)}</WihText>

            <WihCard>
                <WihTitle style={styles.subTitle}>{t(Labels.oneTimeEvent)}</WihTitle>
                <WihText style={styles.text}>{t(Labels.descriptions.oneTimeEvent)}</WihText>
                <WihButton style={styles.buttons} onPress={routeToOneTime}>
                    {t(Labels.actions.create)}
                </WihButton>
            </WihCard>

            <WihDivider />

            <WihCard>
                <WihTitle style={styles.subTitle}>{t(Labels.repeatedEvent)}</WihTitle>
                <WihText style={styles.text}>{t(Labels.descriptions.repeatedEvent)}</WihText>
                <WihButton style={styles.buttons} onPress={routeToRepeated}>
                    {t(Labels.actions.create)}
                </WihButton>
            </WihCard>
        </WihView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
    },
    description: {
        textAlign: "center",
        marginBottom: 20,
    },
    subTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 5,
    },
    text: {
        textAlign: "center",
        marginBottom: 10,
    },
    buttons: {
        width: 160,
        marginTop: 10,
    }
});

export default Create;