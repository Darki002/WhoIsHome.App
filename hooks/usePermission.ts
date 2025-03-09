import {useCallback} from "react";
import {WihLogger} from "@/helper/WihLogger";
import {useWihUser} from "@/components/appContexts/WihUserContext";

export function usePermission(){
    const user = useWihUser();

    return useCallback((permittedUserId?: number) => {
        if(!user) {
            WihLogger.warn("(Permission Check) Logged in user was not being loaded.");
            return false;
        }
        if(!permittedUserId) {
            WihLogger.warn("(Permission Check) There was no given user ID that can access this resource.");
            return false;
        }
        return permittedUserId === user.id;
    }, [user]);
}