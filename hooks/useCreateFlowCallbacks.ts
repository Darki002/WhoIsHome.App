import {useRouter} from "expo-router";
import {useCallback} from "react";
import Toast from "react-native-root-toast";
import {WihResponse} from "@/helper/fetch/WihResponse";
import useWihApi from "@/hooks/useWihApi";

export default function useCreateFlowCallbacks(endpoint: string): [(body: any) => void, () => void] {
    const router = useRouter();

    const onCancel = useCallback(() => router.replace("/protected/(tabs)/create"), []);

    const onResponse = useCallback((response: WihResponse<any> | string) => {
        if (typeof response === "string" || !response.isValid()) {
            Toast.show('Failed to create Event', {
                duration: Toast.durations.SHORT,
            });
        }
        router.replace("/protected/(tabs)/profile");
    }, []);

    const callWihApi = useWihApi({
        endpoint: endpoint,
        method: "POST"
    });

    const callApi = useCallback((body: any) => {
        callWihApi(body).then(onResponse)
    }, [callWihApi])

    return [callApi, onCancel];
}