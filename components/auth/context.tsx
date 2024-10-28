import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { wihFetch } from '../api/whoIsHomeApi';

export type LoginInfos = {
    email: string | undefined;
    password: string | undefined;
}

export interface Creds {
    userName: string;
    email: string;
    token: string;
}

export type Tokens = {
    Token: string | null;
    RefreshToken: string | null;
}

// Add Registraition

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

    return (
        <AuthContext.Provider
            value={{
                signIn: async ({ email, password }) => {
                    if (!email || !password)
                        return "Missing Login Informations";

                    const respones = await wihFetch<Tokens>({ endpoint: "login", method: "POST", body: { email, password } });
                    if (respones.hasError) {
                        return respones.errorMessage;
                    }
                    setSession(respones.response?.Token!);
                    setRefreshToken(respones.response?.RefreshToken!)
                    return null;
                },
                signOut: () => {
                    setSession(null);
                    setRefreshToken(null);
                    // Redirects automaticly to the Login screent when Layout is rerendered
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