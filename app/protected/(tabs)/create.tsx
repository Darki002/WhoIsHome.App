import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import {WihButton} from "@/components/input/WihButton";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";
import {StyleSheet} from "react-native";
import WihDivider from "@/components/WihDivider";
import WihCard from "@/components/WihCard";

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
        <WihView center="full" style={styles.mainContainer}>
            <WihTitle>{t(Labels.titles.eventCreator)}</WihTitle>
            <WihText style={styles.description}>{t(Labels.descriptions.eventCreator)}</WihText>

            {/* One-Time Event Section */}
            <WihCard>
                <WihTitle style={styles.subTitle}>{t(Labels.oneTimeEvent)}</WihTitle>
                <WihText style={styles.text}>{t(Labels.descriptions.oneTimeEvent)}</WihText>
                <WihButton style={styles.buttons} onPress={routeToOneTime}>
                    {t(Labels.actions.create)}
                </WihButton>
            </WihCard>

            {/* Divider */}
            <WihDivider />

            {/* Repeated Event Section */}
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