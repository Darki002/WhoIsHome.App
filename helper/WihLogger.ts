import * as Sentry from "@sentry/react-native";

export class WihLogger {
    static log(message: string) {
        if (__DEV__) {
            console.log(`[LOG] ${message}`);
        }
    }

    static warn(message: string) {
        if (__DEV__) {
            console.warn(`[WARN] ${message}`);
        }
        Sentry.captureMessage(message, { level: "warning" });
    }

    static error(error: Error | string) {
        if (__DEV__) {
            console.error(`[ERROR] ${error}`);
        }
        Sentry.captureException(error);
    }

    static info(message: string) {
        if (__DEV__) {
            console.info(`[INFO] ${message}`);
        }
    }

    static debug(message: any){
        if(__DEV__){
            console.debug(message);
        }
    }
}
