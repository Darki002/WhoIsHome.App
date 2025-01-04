import {LoginInfos, useSession} from "@/components/auth/context";
import {WihEmailInput, WihPasswordInput} from "@/components/input/WihInput";
import {WihButton} from "@/components/input/WihButton";
import {WihText, WihTitle} from "@/components/WihText";
import WihView from "@/components/WihView";
import React, {useState} from "react";
import {StyleSheet} from "react-native";

const Login = () => {
    const [email, onChangeEmail] = useState<string>("");
    const [password, onChangePassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const {signIn} = useSession();

    async function onLogIn({email, password}: LoginInfos) {
        if (!email) {
            setError("Email is missing!");
            return;
        }
        if (!password) {
            setError("Password is missing!");
            return;
        }

        const error = await signIn({email: baseUri, password: apikey});
        if (error) {
            setError(error);
        }
    }

    return (
        <WihView center="full">
            <WihTitle>Login</WihTitle>

            <WihEmailInput
                value={email}
                onChangeText={onChangeEmail}
                style={styles.email}
                autoFocus
            />
            <WihPasswordInput
                value={password}
                onChangeText={onChangePassword}
                style={styles.password}
                autoCompleteType="current"
            />

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton onPress={async () => onLogIn({email: baseUri, password: apikey})}>Login</WihButton>
        </WihView>
    )
}

const styles = StyleSheet.create({
    email: {
        marginTop: 20
    },
    password: {
        marginVertical: 20
    },
    login: {
        marginTop: 15
    }
});

export default Login;