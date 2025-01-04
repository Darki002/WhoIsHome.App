import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTextInput} from "@/components/input/WihInput";
import {WihButton} from "@/components/input/WihButton";
import React, {useState} from "react";
import {ApiConfig, useApiConfig} from "@/components/config/context";
import {StyleSheet} from "react-native";

export default function Index() {
    const [apikey, setApiKey] = useState<string>("");
    const [baseUri, setBaseUri] = useState<string>("");
    const [error, setError] = useState<string>("");
    const {setConfig} = useApiConfig();

    async function onSubmit({apikey, baseUri}: ApiConfig) {
        if (!baseUri) {
            setError("Base Url is missing!");
            return;
        }
        if (!apikey) {
            setError("Api Key is missing!");
            return;
        }

        const error = await setConfig({apikey, baseUri});
        if (error) {
            setError(error);
        }
    }

    return (
        <WihView center="full">
            <WihTitle>Login</WihTitle>

            <WihTextInput
                value={baseUri}
                onChangeText={setBaseUri}
                style={styles.baseUri}
                placeholder="Base Url"
                autoFocus/>
            <WihTextInput
                value={apikey}
                onChangeText={setApiKey}
                style={styles.apikey}
                placeholder="API Key"/>

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton onPress={async () => onSubmit({apikey, baseUri})}>Submit</WihButton>
        </WihView>
    )
}

const styles = StyleSheet.create({
    baseUri: {
        marginTop: 20
    },
    apikey: {
        marginVertical: 20
    }
});