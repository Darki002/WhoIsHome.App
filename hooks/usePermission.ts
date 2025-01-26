import {useCallback, useEffect, useState} from "react";
import {useSession} from "@/components/appContexts/AuthContext";
import {wihFetch} from "@/helper/WihApi";
import {Tokens} from "@/constants/WihTypes/Auth";
import {User} from "@/constants/WihTypes/User";
import {useApiConfig} from "@/components/appContexts/ConfigContext";

export function usePermission(){
    const {config} = useApiConfig();
    const [userId, setUserId] = useState<number | null>();
    const {session, onNewSession} = useSession();

    function onNewTokens(tokens: Tokens | undefined) {
        if (tokens) {
            onNewSession(tokens);
        }
    }

    useEffect(() => {
        if (!session) return;

        wihFetch<User>({
            endpoint: "User/Me",
            method: "GET",
            tokens: session,
            config: config!,
            onNewTokens})
            .then(e => setUserId(e.response?.id));
    }, [session]);

    return useCallback((permittedUserId?: number) => {
        if(!permittedUserId) return false;
        return permittedUserId === userId;
    }, [userId]);
}