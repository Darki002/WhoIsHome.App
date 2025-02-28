import {useRouter} from "expo-router";
import {useCallback} from "react";
import Toast from "react-native-root-toast";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";
import {WihResponse} from "@/helper/fetch/WihResponse";

export default function useCreateFlowCallbacks(endpoint: string): [(body: any) => void, () => void] {
    const router = useRouter();

    const onCancel = useCallback(() => router.replace("/protected/(tabs)/create"), []);

    const onResponse = useCallback((response: WihResponse<{}> | null) => {
        if (!response || !response.isValid()) {
            Toast.show('Failed to create Event', {
                duration: Toast.durations.SHORT,
            });
        }
        router.replace("/protected/(tabs)/profile");
    }, []);

    const callWihApi = useWihApiCallable({
        endpoint: endpoint,
        method: "POST",
        onResponse
    });

    return [callWihApi, onCancel];
}