import {useCallback} from "react";
import Toast from "react-native-root-toast";
import {useTranslation} from "react-i18next";
import {useRouter} from "expo-router";
import {WihResponse} from "@/helper/fetch/WihResponse";

const useWihResponseHandler = (messageLabel: string, errorLabel: string) => {
    const {t} = useTranslation();

    return useCallback((res: WihResponse<any> | string): boolean => {
        if (typeof res === "string" || !res || !res.isValid()) {
            Toast.show(t(errorLabel), {
                duration: Toast.durations.LONG,
            });
            return false;
        }

        Toast.show(t(messageLabel), {
            duration: Toast.durations.SHORT,
        });
        return true;
    }, []);
}

export default useWihResponseHandler;