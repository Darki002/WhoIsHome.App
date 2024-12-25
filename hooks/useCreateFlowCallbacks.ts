import {useRouter} from "expo-router";
import {useCallback} from "react";
import {WihResponse} from "@/components/api/WihApi";
import Toast from "react-native-root-toast";
import useWihApiCallable from "@/hooks/wihApi/useWihApiCallable";

export default function useCreateFlowCallbacks(endpoint: string): [(body: any) => void, () => void] {
    const router = useRouter();

    const onCancel = useCallback(() => router.replace("/(tabs)/create"), []);

    const onResponse = useCallback((response: WihResponse | null) => {
        if (!response || response.hasError) {
            console.error(response?.error ?? "Unknown Error");
            Toast.show('Failed to create Event', {
                duration: Toast.durations.SHORT,
            });
        }
        router.replace("/(tabs)");
    }, []);

    const callWihApi = useWihApiCallable({
        endpoint: endpoint,
        method: "POST",
        onResponse
    });

    return [callWihApi, onCancel];
}