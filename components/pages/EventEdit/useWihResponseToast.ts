import {useCallback} from "react";
import Toast from "react-native-root-toast";
import {useTranslation} from "react-i18next";
import {useRouter} from "expo-router";
import {WihResponse} from "@/helper/fetch/WihResponse";

const useWihResponseToast = (messageLabel: string, errorLabel: string) => {
    const {t} = useTranslation();
    const router = useRouter();

    return useCallback((res: WihResponse<any> | string) => {
        if (typeof res === "string" || !res || !res.isValid()) {
            Toast.show(t(errorLabel), {
                duration: Toast.durations.SHORT,
            });
            return;
        }

        Toast.show(t(messageLabel), {
            duration: Toast.durations.SHORT,
        });
        router.back();
    }, []);
}

export default useWihResponseToast;