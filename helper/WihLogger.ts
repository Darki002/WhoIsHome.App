import * as Sentry from "@sentry/react-native";

export class WihLogger {
    static log(component: string, message: string) {
        if (__DEV__) {
            console.log(`[LOG] (${component}) ${message}`);
        }
    }

    static warn(component: string, message: string) {
        if (__DEV__) {
            console.warn(`[WARN] (${component}) ${message}`);
        }
        Sentry.captureMessage(message, { level: "warning" });
    }

    static error(component: string, error: Error | string) {
        if (__DEV__) {
            console.error(`[ERROR] (${component}) ${error}`);
        }
        Sentry.captureException(error);
    }

    static info(component: string, message: string) {
        if (__DEV__) {
            console.info(`[INFO] (${component}) ${message}`);
        }
        Sentry.captureMessage(message, {level: "info"});
    }

    static debug(component: string, message: any){
        if(__DEV__){
            console.debug(`[DEBUG] (${component}) ${message}`);
        }
    }
}
