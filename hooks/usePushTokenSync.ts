import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { WihLogger } from "@/helper/WihLogger";
import useWihApi from "@/hooks/useWihApi";
import {Endpoints} from "@/constants/endpoints";
import {getLocales} from "expo-localization";

const LAST_PUSH_TOKEN_KEY = 'lastPushToken';
const LAST_LANGUAGE_CODE_KEY = 'languageCode';

export function usePushTokenSync() {
    const pushTokenApi = useWihApi<{ token: string | null, languageCode?: string | null, enable?: boolean }, never>({
        endpoint: Endpoints.pushUp,
        method: "POST",
    });

    const syncPushToken = useCallback(async (pushToken: string) => {
        try {
            const lastToken = await AsyncStorage.getItem(LAST_PUSH_TOKEN_KEY);
            const lastLanguageCode = await AsyncStorage.getItem(LAST_LANGUAGE_CODE_KEY);

            const languageCode = getLocales()[0]?.languageCode;

            WihLogger.debug(usePushTokenSync.name, `languageCode : ${languageCode} lastLanguageCode : ${lastLanguageCode}`);
            WihLogger.debug(usePushTokenSync.name, `pushToken : ${pushToken} lastToken : ${lastToken}`);
            if (lastToken === pushToken && languageCode === lastLanguageCode) {
                WihLogger.debug("PushToken", "Token unchanged, skipping backend sync.");
                return;
            }

            const response = await pushTokenApi({
                token: pushToken,
                languageCode: languageCode
            });

            if (typeof response === 'string') {
                WihLogger.warn("PushToken", "Sync failed: " + response);
                return;
            }

            if (response.isValid()) {
                WihLogger.log("PushToken", "Token successfully synced.");
                await AsyncStorage.setItem(LAST_PUSH_TOKEN_KEY, pushToken);

                if(languageCode){
                    WihLogger.debug(usePushTokenSync.name, `Setting language code: ${languageCode}`);
                    await AsyncStorage.setItem(LAST_LANGUAGE_CODE_KEY, languageCode);
                } else {
                    await AsyncStorage.removeItem(LAST_LANGUAGE_CODE_KEY);
                }
            }
        } catch (err: any) {
            WihLogger.error(usePushTokenSync.name, err);
        }
    }, [pushTokenApi]);

    const disablePushUp = useCallback(async () => {
        const token = await AsyncStorage.getItem(LAST_PUSH_TOKEN_KEY);
        if (!token) return;

        const response = await pushTokenApi({ token: null, enable: false });
        if (typeof response !== 'string' && response.isValid()) {
            await AsyncStorage.removeItem(LAST_PUSH_TOKEN_KEY);
            WihLogger.debug("PushToken", "Disabled and cleared.");
        }
    }, [pushTokenApi]);

    return { syncPushToken, disablePushUp };
}
