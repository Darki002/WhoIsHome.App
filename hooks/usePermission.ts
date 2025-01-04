import {useCallback, useEffect, useState} from "react";
import {useSession} from "@/components/auth/context";
import {wihFetch} from "@/helper/WihApi";
import {Tokens} from "@/constants/WihTypes/Auth";
import {User} from "@/constants/WihTypes/User";

export function usePermission(){
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
            onNewTokens})
            .then(e => setUserId(e.response?.id));
    }, [session]);

    return useCallback((permittedUserId?: number) => {
        if(!permittedUserId) return false;
        return permittedUserId === userId;
    }, [userId]);
}