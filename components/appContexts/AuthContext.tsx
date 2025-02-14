import {createContext, type PropsWithChildren, useContext, useEffect} from 'react';
import {useStorageState} from '@/hooks/useStorageState';
import {WihApiError, wihFetch} from '@/helper/WihFetch';
import {Tokens} from "@/constants/WihTypes/Auth";
import {Endpoints} from "@/constants/endpoints";
import {ApiConfig, useApiConfig} from "@/components/appContexts/ConfigContext";
import {useRouter} from "expo-router";
import * as Sentry from "@sentry/react-native";

export type LoginInfos = {
    email: string | undefined;
    password: string | undefined;
}

const AuthContext = createContext<{
    signIn: ({email, password}: LoginInfos) => Promise<string | null>;
    signOut: () => void;
    onNewSession: (tokens: Tokens) => void;
    session: Tokens | null;
    isSessionLoading: boolean;
}>({
    signIn: async () => null,
    signOut: () => null,
    onNewSession: _ => null,
    session: null,
    isSessionLoading: false,
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
    const {config, isApiConfigLoading} = useApiConfig();
    const [[isLoadingSession, session], setSession] = useStorageState('session');
    const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState('refreshToken');

    const isLoading = isLoadingSession || isLoadingRefreshToken || isApiConfigLoading;

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
                        return "Missing Login Information";

                    const response = await sendLoginRequest(config!, email, password);
                    if (response.hasError) {
                        return response.error;
                    }
                    setSession(response.response?.jwtToken || null);
                    setRefreshToken(response.response?.refreshToken || null);
                    return null;
                },
                signOut: () => {
                    setSession(null);
                    setRefreshToken(null);
                },
                onNewSession: tokens => {
                    setSession(tokens.jwtToken);
                    setRefreshToken(tokens.refreshToken)
                },
                session: session && refreshToken ? {jwtToken: session, refreshToken: refreshToken} : null,
                isSessionLoading: isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

async function sendLoginRequest(config: ApiConfig, email: string, password: string){

    try{
        return await wihFetch<Tokens>({
            endpoint: Endpoints.auth.login,
            method: "POST",
            config: config!,
            body: {email, password}
        });
    } catch (error: any){
        if(error instanceof WihApiError){
            if(error.response.status !== 401){
                Sentry.captureException(error);
            }
            return error.response;
        } else {
            Sentry.captureException(error);
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