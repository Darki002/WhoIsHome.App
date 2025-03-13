import React, {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import useWihApi from "@/hooks/useWihApi";
import {WihLogger} from "@/helper/WihLogger";
import {WihResponse} from "@/helper/fetch/WihResponse";
import {useSession} from "@/components/appContexts/AuthContext";
import {useApiConfig} from "@/components/appContexts/ConfigContext";

const WihUserContext = createContext<{
    user: User | null;
    isUserLoading: boolean;
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
    const {isSessionLoading, isSignedIn} = useSession();
    const {isApiConfigLoading, isConfigured} = useApiConfig();

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getUser = useWihApi<User>({
        endpoint: Endpoints.user.me,
        method: "GET"
    });

    useEffect(() => {
        if(!isSignedIn || !isConfigured) {
            WihLogger.debug(`Won't load user! Is not logged in ${isSignedIn} | or not configured ${isConfigured}`); // TODO
            return;
        }

        if (isSessionLoading || isApiConfigLoading) {
            WihLogger.debug(`Won't load user! Still loading other stuff: Session =  ${isSessionLoading} | Config = ${isApiConfigLoading}`); // TODO
            return;
        }

        WihLogger.debug(`Start loading with: Session =  ${isSessionLoading} | Config = ${isApiConfigLoading}`) // TODO
        setIsLoading(true);
        getUser()
            .then(u => {
                setUser(handleResponse(u));
                setIsLoading(false);
            });
    }, [isSessionLoading, isApiConfigLoading, isSignedIn, isConfigured]);

    return (
        <WihUserContext.Provider value={{
            user: user,
            isUserLoading: isLoading
        }}>
            {children}
        </WihUserContext.Provider>
    );
}

function handleResponse(response: WihResponse<User> | string) {
    if (response instanceof WihResponse) {

        if (response.isValid()) return response.data!;
        WihLogger.error(`(WihUserProvider) Could not load logged in User! | Message: ${response.getErrorMessage()}`);
        return null;
    } else {
        WihLogger.error(`(WihUserProvider) ${response}`);
        return null;
    }
}