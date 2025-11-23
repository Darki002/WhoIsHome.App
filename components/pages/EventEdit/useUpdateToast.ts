import {useCallback} from "react";
import Toast from "react-native-root-toast";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {useRouter} from "expo-router";
import {WihResponse} from "@/helper/fetch/WihResponse";

const useUpdateToast = () => {
    const {t} = useTranslation();
    const router = useRouter();

    return useCallback((res: WihResponse<{}> | string) => {
        if (typeof res === "string" || !res || !res.isValid()) {
            Toast.show(t(Labels.toast.error.updateEvent), {
                duration: Toast.durations.SHORT,
            });
            return;
        }

        Toast.show(t(Labels.toast.success.updateEvent), {
            duration: Toast.durations.SHORT,
        });
        router.back();
    }, []);
}

export default useUpdateToast;