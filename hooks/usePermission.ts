import {useCallback} from "react";
import {User} from "@/constants/WihTypes/User";
import useWihApi from "@/hooks/wihApi/useWihApi";

export function usePermission(){
    const [user] = useWihApi<User>({endpoint: "User/Me", method: "GET"});

    return useCallback((permittedUserId?: number) => {
        console.log(`Permission check for ${permittedUserId} with current user ${user?.response?.id}`);
        if(!user?.response) return false;
        if(!permittedUserId) return false;
        return permittedUserId === user?.response?.id;
    }, [user]);
}