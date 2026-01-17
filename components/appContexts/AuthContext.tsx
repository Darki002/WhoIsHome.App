import React, {createContext, type PropsWithChildren, useContext, useEffect} from 'react';
import {useStorageState} from '@/hooks/useStorageState';
import {Tokens} from "@/constants/WihTypes/Auth";
import {Endpoints} from "@/constants/endpoints";
import {ApiConfig, useApiConfig} from "@/hooks/useApiConfig";
import {useRouter} from "expo-router";
import {WihFetchBuilder} from "@/helper/fetch/WihFetchBuilder";
import {usePushTokenSync} from "@/hooks/usePushTokenSync";
import {WihLogger} from "@/helper/WihLogger";

export type LoginInfos = {
    email: string | undefined;
    password: string | undefined;
}

const AuthContext = createContext<{
    signIn: ({email, password}: LoginInfos) => Promise<boolean>;
    signOut: () => void;
    onNewSession: (tokens: Tokens) => void;
    session: Tokens | null;
    isSessionLoading: boolean;
    isSignedIn: boolean;
}>({
    signIn: async () => false,
    signOut: () => null,
    onNewSession: _ => null,
    session: null,
    isSessionLoading: true,
    isSignedIn: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}

export function SessionProvider({children}: PropsWithChildren) {
    const router = useRouter();
    const config = useApiConfig();
    const { disablePushUp } = usePushTokenSync();
    const [[isLoadingSession, session], setSession] = useStorageState('session');
    const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState('refreshToken');

    const isLoading = isLoadingSession || isLoadingRefreshToken;

    useEffect(() => {
        if (!isLoading && (!session || !refreshToken)) {
            router.replace("/auth/login");
            return;
        }
    }, [isLoading, session, refreshToken, router]);

    return (
        <AuthContext.Provider
            value={{
                signIn: async ({email, password}) => {
                    if (!email || !password)
                        return false;

                    const response = await sendLoginRequest(config!, email, password);
                    if (!response.isValid()) {
                        return false;
                    }

                    setSession(response.data?.jwtToken || null);
                    setRefreshToken(response.data?.refreshToken || null);
                    return true;
                },
                signOut: async () => {
                    await disablePushUp();
                    await sendLogoutRequest(config!, {jwtToken: session, refreshToken: refreshToken});
                    setSession(null);
                    setRefreshToken(null);
                    router.replace("/auth/login");
                },
                onNewSession: tokens => {
                    WihLogger.info(SessionProvider.name, `New Session received! Updating local storage...`);
                    setSession(tokens.jwtToken);
                    setRefreshToken(tokens.refreshToken)
                },
                session: session && refreshToken ? {jwtToken: session, refreshToken: refreshToken} : null,
                isSessionLoading: isLoading,
                isSignedIn: session != null && refreshToken != null
            }}>
            {children}
        </AuthContext.Provider>
    );
}

async function sendLoginRequest(config: ApiConfig, email: string, password: string){
    return await new WihFetchBuilder(config)
        .setEndpoint(Endpoints.auth.login)
        .setMethod("POST")
        .setBody({email, password})
        .fetch<Tokens>();
}

async function sendLogoutRequest(config: ApiConfig, tokens: Tokens){
    return await new WihFetchBuilder(config, tokens)
        .setEndpoint(Endpoints.auth.logout)
        .setMethod("POST")
        .fetch<{}>();
}
