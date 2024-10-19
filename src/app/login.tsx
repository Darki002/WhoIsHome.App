import { LoginInfos, useSession } from "@/components/auth/context";
import { WihEmailInput, WihPasswordInput } from "@/components/login/WihInput";
import { WihText, WihTitle } from "@/components/WihText";
import WihView from "@/components/WihView";
import { useState } from "react";
import { Button, StyleSheet } from "react-native";

// https://docs.expo.dev/router/reference/authentication/

const Login = () => {
    const [email, onChangeEmail] = useState<string>();
    const [password, onChangePassword] = useState<string>();
    const [error, setError] = useState<string>();
    const { session, isLoading, signIn } = useSession();

    function OnLogIn({ email, password }: LoginInfos) {
        if (!email) {
            setError("Email is missing!");
            return;
        }
        if (!password) {
            setError("Password is missing!");
            return;
        }

        const creds = signIn({ email, password });

        // Login on server
        // Save user name, email and token to session
    }

    return (
        <WihView center="horizontal">
            <WihTitle>Login</WihTitle>

            <WihEmailInput value={email} onChangeText={onChangeEmail} style={styles.email} autoFocus />
            <WihPasswordInput value={password} onChangeText={onChangePassword} style={styles.password} autoCompleteType="current" />

            {error &&
                <WihText style={{ color: "red" }}>{error}</WihText>
            }

            <Button title="Login" onPress={() => OnLogIn({ email, password })} />
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