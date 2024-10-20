import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';

export type LoginInfos = {
    email: string | undefined;
    password: string | undefined;
}

export interface Creds {
    userName: string;
    email: string;
    token: string;
}

const AuthContext = createContext<{
    signIn: ({ email, password }: LoginInfos) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
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
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: ({ email, password }) => {
                    // Perform sign-in logic here
                    // Save user name, email and token to session
                    setSession('xxx');
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}