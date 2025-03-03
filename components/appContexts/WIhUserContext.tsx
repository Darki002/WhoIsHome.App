import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import useWihFetch from "@/hooks/wihApi/useWihFetch";
import {useApiConfig} from "@/components/appContexts/ConfigContext";

const WihUserContext = createContext<{
    user: User | null,
    isUserLoading: boolean
}>({
    user: null,
    isUserLoading: true
});

export function useWihUser() {
    const value = useContext(WihUserContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useWihUser must be wrapped in a <WihUserProvider />');
        }
    }

    return value;
}

export function WihUserProvider({children}: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {isApiConfigLoading} = useApiConfig();

    const getUser = useWihFetch<User>({
        endpoint: Endpoints.user.me,
        method: "GET"
    });

    useEffect(() => {
        if(isApiConfigLoading) return;
        
        getUser()
            .then(u => setUser(u?.data ?? null))
            .then(() => setIsLoading(false));
    }, [isApiConfigLoading]);

    return (
        <WihUserContext.Provider value={{user, isUserLoading: isLoading}}>
            {children}
        </WihUserContext.Provider>
    )
}