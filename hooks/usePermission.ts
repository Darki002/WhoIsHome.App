import {useCallback, useEffect, useState} from "react";
import {useSession} from "@/components/appContexts/AuthContext";
import {wihFetch} from "@/helper/WihFetch";
import {Tokens} from "@/constants/WihTypes/Auth";
import {User} from "@/constants/WihTypes/User";
import {useApiConfig} from "@/components/appContexts/ConfigContext";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export function usePermission(){
    const [userId, setUserId] = useState<number | null>();
    const getUser = useWihFetch<User>({endpoint: "User/Me", method: "GET"});

    useEffect(() => {
        getUser(null!).then(e => setUserId(e?.response?.id));
    }, []);

    return useCallback((permittedUserId?: number) => {
        if(!permittedUserId) return false;
        return permittedUserId === userId;
    }, [userId]);
}