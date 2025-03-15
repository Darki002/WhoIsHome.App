import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {Platform} from "react-native";
import {WihLogger} from "@/helper/WihLogger";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    if(Platform.OS === "android"){
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if(!Device.isDevice) {
        WihLogger.warn("Notifications", "notification can't be registered. Must use a physical device!");
        return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if(existingStatus !== "granted"){
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if(finalStatus === "granted"){
        WihLogger.error("Notifications", "Permission not granted to get push token for push notification!");
        return;
    }

    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId
        ?? Constants?.easConfig?.projectId;

    if(!projectId) {
        WihLogger.error("Notifications", "Project ID not found");
        return;
    }

    try{
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        WihLogger.debug("Notifications", pushTokenString); // TODO
        return pushTokenString;
    }
    catch (e: any) {
        WihLogger.error("Notifications", e);
    }
}