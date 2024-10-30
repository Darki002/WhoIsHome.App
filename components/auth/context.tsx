import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { wihFetch } from '../api/whoIsHomeApi';
import {useRouter} from "expo-router";

export type LoginInfos = {
    email: string | undefined;
    password: string | undefined;
}

export type Tokens = {
    Token: string | null;
    RefreshToken: string | null;
}

// TODO: Add Registration

const AuthContext = createContext<{
    signIn: ({ email, password }: LoginInfos) => Promise<string | null>;
    signOut: () => void;
    session?: Tokens;
    isLoading: boolean;
}>({
    signIn: async () => null,
    signOut: () => null,
    session: undefined,
    isLoading: false,
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

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoadingSession, session], setSession] = useStorageState('session');
    const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState('refreshToken');
    const router = useRouter()

    return (
        <AuthContext.Provider
            value={{
                signIn: async ({ email, password }) => {
                    if (!email || !password)
                        return "Missing Login Information";

                    const response = await wihFetch<Tokens>({ endpoint: "Auth/Login", method: "POST", body: { email, password } });
                    if (response.hasError) {
                        return response.error;
                    }
                    setSession(response.response?.Token!);
                    setRefreshToken(response.response?.RefreshToken!)
                    router.replace("/");
                    return null;
                },
                signOut: () => {
                    setSession(null);
                    setRefreshToken(null);
                    router.replace("/login");
                },
                session: {
                    Token: session,
                    RefreshToken: refreshToken
                },
                isLoading: isLoadingSession || isLoadingRefreshToken,
            }}>
            {children}
        </AuthContext.Provider >
    );
}