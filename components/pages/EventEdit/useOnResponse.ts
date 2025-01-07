import {useCallback} from "react";
import {WihResponse} from "@/helper/WihApi";
import Toast from "react-native-root-toast";
import Labels from "@/constants/locales/Labels";
import {useTranslation} from "react-i18next";
import {useRouter} from "expo-router";

const useOnResponse = (id: number | string) => {
    const {t} = useTranslation();
    const router = useRouter();

    return  useCallback((res: WihResponse | null) => {
        if (!res || res.hasError) {
            console.error(res?.error ?? "Unknown Error");
            Toast.show(t(Labels.toast.error.updateEvent), {
                duration: Toast.durations.SHORT,
            });
            return;
        }

        Toast.show(t(Labels.toast.success.updateEvent), {
            duration: Toast.durations.SHORT,
        });
        router.back();
    }, [id]);
}

export default useOnResponse;