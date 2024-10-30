import {LoginInfos, useSession} from "@/components/auth/context";
import React, {useState} from "react";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihEmailInput, WihPasswordInput, WihUsernameInput} from "@/components/login/WihInput";
import {WihButton} from "@/components/WihButton";
import {StyleSheet} from "react-native";

const register = () => {
    const [userName, onChangeUserName] = useState<string>("");
    const [email, onChangeEmail] = useState<string>("");
    const [password, onChangePassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const { signIn } = useSession();

    async function onRegister({ email, password }: LoginInfos) {
        if(!userName) {
            setError("UserName is missing!");
            return;
        }

        if (!email) {
            setError("Email is missing!");
            return;
        }
        if (!password) {
            setError("Password is missing!");
            return;
        }

        // Register
        const error = await signIn({email, password});

        if (error) {
            setError(error);
        }
    }

    return (
        <WihView center="horizontal">
            <WihTitle>Login</WihTitle>

            <WihUsernameInput value={userName} onChangeText={onChangeUserName} style={styles.userName} autoFocus />
            <WihEmailInput value={email} onChangeText={onChangeEmail} style={styles.email} />
            <WihPasswordInput value={password} onChangeText={onChangePassword} style={styles.password} autoCompleteType="current" />

            { error && <WihText style={{ color: "red" }}>{error}</WihText> }

            <WihButton onPress={async () => onRegister({ email, password })} >Register</WihButton>
        </WihView>
    )

}

const styles = StyleSheet.create({
    userName: {
        marginTop: 20
    },
    email: {
        marginVertical: 20
    },
    password: {
        marginVertical: 20
    }
});

export default register;