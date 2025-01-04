import {createContext, type PropsWithChildren, useContext} from 'react';
import {useStorageState} from '@/hooks/useStorageState';
import {wihFetch} from '@/helper/WihApi';
import {Tokens} from "@/constants/WihTypes/Auth";

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
    const [[isLoadingSession, session], setSession] = useStorageState('session');
    const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState('refreshToken');

    const isLoading = isLoadingSession || isLoadingRefreshToken;

    return (
        <AuthContext.Provider
            value={{
                signIn: async ({email, password}) => {
                    if (!email || !password)
                        return "Missing Login Information";

                    const response = await wihFetch<Tokens>({
                        endpoint: "Auth/Login",
                        method: "POST",
                        body: {email, password}
                    });
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