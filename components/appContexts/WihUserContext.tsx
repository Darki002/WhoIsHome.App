import React, {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";
import {User} from "@/constants/WihTypes/User";
import {Endpoints} from "@/constants/endpoints";
import useWihApi from "@/hooks/useWihApi";
import {WihLogger} from "@/helper/WihLogger";
import {WihLoading} from "@/components/WihComponents/feedback/WihLoading";
import {WihResponse} from "@/helper/fetch/WihResponse";

const WihUserContext = createContext<User | null>(null);

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

    const getUser = useWihApi<User>({
        endpoint: Endpoints.user.me,
        method: "GET"
    });

    useEffect(() => {
        getUser()
            .then(u => {
                setUser(handleResponse(u));
                setIsLoading(false);
            });
    }, []);

    if(isLoading) {
        return <WihLoading/>;
    }

    return (
        <WihUserContext.Provider value={user}>
            {children}
        </WihUserContext.Provider>
    );
}

function handleResponse(response: WihResponse<User> | string){
    if(response instanceof WihResponse){

        if(response.isValid()) return response.data!;
        WihLogger.error(`(WihUserProvider) Could not load logged in User! | Message: ${response.error}`);
        return null;
    }
    else {
        WihLogger.error(response);
        return null;
    }
}