import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTextInput} from "@/components/input/WihInput";
import {WihButton} from "@/components/input/WihButton";
import React, {useState} from "react";
import {ApiConfig, useApiConfig} from "@/components/config/context";
import {Dimensions, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

export default function Index() {
    const {t} = useTranslation();
    const windowDimensions = Dimensions.get('window');
    const router = useRouter();

    const [apikey, setApiKey] = useState<string>("");
    const [baseUri, setBaseUri] = useState<string>("");
    const {setConfig} = useApiConfig();

    const [error, setError] = useState<string>("");

    async function onSubmit({apikey, baseUri}: ApiConfig) {
        if (!baseUri) {
            setError(t(Labels.errors.missingBaseUri));
            return;
        }
        if (!apikey) {
            setError(t(Labels.errors.missingApiKey));
            return;
        }

        const error = await setConfig({apikey, baseUri});
        if (error) {
            setError(error);
        }
        else {
            router.replace("/");
        }
    }

    return (
        <WihView center="full">
            <WihTitle>{t(Labels.titles.appConfig)}</WihTitle>

            <WihTextInput
                value={baseUri}
                onChangeText={setBaseUri}
                style={styles.baseUri}
                placeholder={t(Labels.placeholders.baseUri)}
                autoFocus/>
            <WihTextInput
                value={apikey}
                onChangeText={setApiKey}
                style={[styles.apikey, {maxWidth: windowDimensions.width * 0.9}]}
                placeholder={t(Labels.placeholders.apikey)}/>

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton onPress={async () => onSubmit({apikey, baseUri})}>{t(Labels.actions.save)}</WihButton>
        </WihView>
    )
}

const styles = StyleSheet.create({
    baseUri: {
        marginTop: 20
    },
    apikey: {
        marginVertical: 20,
        height: 40
    }
});