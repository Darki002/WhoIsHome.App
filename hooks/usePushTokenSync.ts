import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { WihLogger } from "@/helper/WihLogger";
import useWihApi from "@/hooks/useWihApi";
import {Endpoints} from "@/constants/endpoints";
import {getLocales} from "expo-localization";

export function usePushTokenSync() {
    const pushTokenApi = useWihApi<{ token: string | null, languageCode?: string | null, enable?: boolean }, never>({
        endpoint: Endpoints.pushUp,
        method: "POST",
    });

    const syncPushToken = useCallback(async (pushToken: string) => {
        try {
            const languageCode = getLocales()[0]?.languageCode;

            const response = await pushTokenApi({
                token: pushToken,
                languageCode: languageCode
            });

            if (typeof response === 'string') {
                WihLogger.error("PushToken", "Sync failed: " + response);
                return;
            }

            if (response.isValid()) {
                WihLogger.debug("PushToken", "Token successfully synced.");
            } else {
                WihLogger.error("PushToken", "Sync failed: " + response.getErrorMessage());
            }
        } catch (err: any) {
            WihLogger.error(usePushTokenSync.name, err);
        }
    }, [pushTokenApi]);

    const disablePushUp = useCallback(async () => {
        if (!token) return;

        const response = await pushTokenApi({ token: null, enable: false });
        if (typeof response !== 'string' && response.isValid()) {
            WihLogger.debug("PushToken", "Disabled and cleared.");
        }
    }, [pushTokenApi]);

    return { syncPushToken, disablePushUp };
}
