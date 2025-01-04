import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihTextInput} from "@/components/input/WihInput";
import {WihButton} from "@/components/input/WihButton";
import React, {useState} from "react";
import {ApiConfig, useApiConfig} from "@/components/config/context";
import {StyleSheet} from "react-native";

export default function Index(){
    const [apikey, onChangeEmail] = useState<string>("");
    const [baseUri, onChangePassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const {setConfig} = useApiConfig();

    async function onSubmit({apikey, baseUri}: ApiConfig) {
        if (!apikey) {
            setError("Email is missing!");
            return;
        }
        if (!baseUri) {
            setError("Password is missing!");
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
                onChangeText={onChangeEmail}
                style={styles.baseUri}
                autoFocus
            />
            <WihTextInput
                value={apikey}
                onChangeText={onChangePassword}
                style={styles.apikey}
            />

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton onPress={async () => onSubmit({apikey, baseUri})}>Login</WihButton>
        </WihView>
    )
}

const styles = StyleSheet.create({
    baseUri: {
        marginTop: 20
    },
    apikey: {
        marginVertical: 20
    },
    login: {
        marginTop: 15
    }
});