import React, {useState} from "react";
import WihView from "@/components/WihView";
import {WihText, WihTitle} from "@/components/WihText";
import {WihEmailInput, WihPasswordInput, WihUsernameInput} from "@/components/input/WihInput";
import {WihButton} from "@/components/input/WihButton";
import {StyleSheet} from "react-native";
import {wihFetch} from "@/helper/WihApi";
import {useSession} from "@/components/auth/context";

const register = () => {
    const [userName, onChangeUserName] = useState<string>("");
    const [email, onChangeEmail] = useState<string>("");
    const [password, onChangePassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const {signIn} = useSession();

    async function onRegister(email: string, password: string, userName: string) {
        if (!userName) {
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

        const body = {
            userName,
            email,
            password
        }

        const response = await wihFetch<string>({endpoint: "Auth/Register", method: "POST", body});
        if (response.hasError) {
            setError(response.error!);
            return;
        }

        const error = await signIn({email, password});
        if (error) {
            setError(error);
        }
    }

    return (
        <WihView center="full">
            <WihTitle>Register</WihTitle>

            <WihUsernameInput
                value={userName}
                onChangeText={onChangeUserName}
                style={styles.userName}
                autoFocus
            />
            <WihEmailInput
                value={email}
                onChangeText={onChangeEmail}
                style={styles.email}
            />
            <WihPasswordInput
                value={password}
                onChangeText={onChangePassword}
                style={styles.password}
                autoCompleteType="current"
            />

            {error ? <WihText style={{color: "red"}}>{error}</WihText> : null}

            <WihButton onPress={async () => onRegister(email, password, userName)}>Register</WihButton>
        </WihView>
    )
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