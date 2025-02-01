import {useCallback, useEffect, useState} from "react";
import {User} from "@/constants/WihTypes/User";
import useWihFetch from "@/hooks/wihApi/useWihFetch";

export function usePermission(){
    const [userId, setUserId] = useState<number | null>();
    const getUser = useWihFetch<User>({endpoint: "User/Me", method: "GET"});

    useEffect(() => {
        getUser().then(e => setUserId(e?.response?.id));
    }, []);

    return useCallback((permittedUserId?: number) => {
        if(!permittedUserId) return false;
        return permittedUserId === userId;
    }, [userId]);
}