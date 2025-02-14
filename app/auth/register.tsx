import React, {useState} from "react";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihEmailInput, WihPasswordInput, WihUsernameInput} from "@/components/input/WihAuthInput";
import {WihButton} from "@/components/input/WihButton";
import {StyleSheet} from "react-native";
import {WihApiError, wihFetch, WihResponse} from "@/helper/WihFetch";
import {useSession} from "@/components/appContexts/AuthContext";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {Endpoints} from "@/constants/endpoints";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import * as Sentry from "@sentry/react-native";

const register = () => {
    const {t} = useTranslation();
    const [userName, onChangeUserName] = useState<string>("");
    const [email, onChangeEmail] = useState<string>("");
    const [password, onChangePassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const {signIn} = useSession();

    async function onRegister(email: string, password: string, userName: string) {
        if (!userName) {
            setError(t(Labels.errors.missingUsername));
            return;
        }
        if (!email) {
            setError(t(Labels.errors.missingEmail));
            return;
        }
        if (!password) {
            setError(t(Labels.errors.missingPassword));
            return;
        }

        const response = await sendRegisterRequest(userName, email, password);
        if (response.hasError) {
            setError(response.error);
        } else {
            const error = await signIn({email, password});
            setError(error);
        }
    }

    return (
        <WihView center="full">
            <WihTitle>{t(Labels.titles.register)}</WihTitle>

            <WihUsernameInput
                value={userName}
                onChangeValue={onChangeUserName}
                autoComplete="new"/>

            <WihEmailInput
                value={email}
                onChangeValue={onChangeEmail}
                style={styles.email}/>

            <WihPasswordInput
                value={password}
                onChangeValue={onChangePassword}
                style={styles.password}
                autoComplete="new"/>

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton
                onPress={async () => onRegister(email, password, userName)}>{t(Labels.actions.register)}</WihButton>
        </WihView>
    )
}

async function sendRegisterRequest(userName: string, email: string, password: string): Promise<WihResponse<string>> {
    const {config} = useApiConfig();

    try{
        return await wihFetch<string>({
            endpoint: Endpoints.auth.register,
            config: config!,
            method: "POST",
            body: {
                userName,
                email,
                password
            }
        });
    } catch (error: any){
        Sentry.captureException(error);

        if(error instanceof WihApiError){
            return error.response;
        } else {
            return {
                hasError: true,
                error: "unknown error",
                response: null,
                refreshFailed: false,
                status: 0
            }
        }
    }
}

const styles = StyleSheet.create({
    userName: {
        marginTop: 20
    },
    email: {
        marginTop: 20
    },
    password: {
        marginVertical: 20
    },
    register: {
        marginTop: 15
    }
});

export default register;