import {LoginInfos, useSession} from "@/components/appContexts/AuthContext";
import {WihEmailInput, WihPasswordInput} from "@/components/WihComponents/input/WihAuthInput";
import {WihButton} from "@/components/WihComponents/input/WihButton";
import {WihText, WihTitle} from "@/components/WihComponents/display/WihText";
import WihView from "@/components/WihComponents/view/WihView";
import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import Labels from "@/constants/locales/Labels";

const Login = () => {
    const { t } = useTranslation();
    const [email, onChangeEmail] = useState<string>("");
    const [password, onChangePassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const {signIn} = useSession();

    async function onLogIn({email, password}: LoginInfos) {
        if (!email) {
            setError(t(Labels.errors.missingEmail));
            return;
        }
        if (!password) {
            setError(t(Labels.errors.missingPassword));
            return;
        }

        if (!await signIn({email, password})){
            setError(t(Labels.errors.invalidCredentials));
        }
    }

    return (
        <WihView center="full">
            <WihTitle>{t(Labels.titles.login)}</WihTitle>

            <WihEmailInput
                value={email}
                onChangeValue={onChangeEmail}
                style={styles.email}
            />

            <WihPasswordInput
                value={password}
                onChangeValue={onChangePassword}
                style={styles.password}
                autoComplete="current"
            />

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton onPress={async () => onLogIn({email, password})}>{t(Labels.actions.login)}</WihButton>
        </WihView>
    )
}

const styles = StyleSheet.create({
    email: {
        marginTop: 20
    },
    password: {
        marginVertical: 20
    }
});

export default Login;