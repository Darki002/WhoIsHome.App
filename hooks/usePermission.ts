import {useCallback} from "react";
import {User} from "@/constants/WihTypes/User";
import useWihApi from "@/hooks/wihApi/useWihApi";
import {WihLogger} from "@/helper/WihLogger";

export function usePermission(){
    const [user] = useWihApi<User>({endpoint: "User/Me", method: "GET"});

    return useCallback((permittedUserId?: number) => {
        if(!user?.data) {
            WihLogger.warn("(Permission Check) Logged in user was not being loaded.");
            return false;
        }
        if(!permittedUserId) {
            WihLogger.warn("(Permission Check) There was no given user ID that can access this resource.");
            return false;
        }
        return permittedUserId === user.data.id;
    }, [user]);
}