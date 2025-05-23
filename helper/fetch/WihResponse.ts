import {WihLogger} from "@/helper/WihLogger";

export class WihResponse<T> {
    private readonly errorMessage?: string;

    readonly status: number;
    readonly success: boolean;
    readonly refreshFailed: boolean;

    readonly data?: T;
    readonly error?: Error;

    private constructor(status: number, success: boolean, data?: T, errorMessage?: string, error?: Error, refreshFailed: boolean = false) {
        this.status = status;
        this.success = success;
        this.data = data;
        this.errorMessage = errorMessage;
        this.error = error;
        this.refreshFailed = refreshFailed;

        WihLogger.debug(WihResponse.name, `Success ${success} | data ${data} | error ${errorMessage} | refresh failed ${refreshFailed}`);
    }

    static async fromResponse<T>(response: Response): Promise<WihResponse<T>> {
        if (response.ok) {
            const isJson = response.headers.get("Content-Type")?.includes("application/json") ?? false
            const data = isJson ? await response.json() : await response.text();
            return new WihResponse<T>(response.status, true, data);
        }

        const errorText = await response.text();
        return new WihResponse<T>(response.status, false, undefined, errorText || response.statusText);
    }

    static fail<T>(errorMessage: string, status: number = 400, refreshFailed: boolean = false): WihResponse<T> {
        return new WihResponse<T>(status, false, undefined, errorMessage, undefined, refreshFailed);
    }

    static error<T>(error: Error): WihResponse<T> {
        return new WihResponse<T>(-1, false, undefined, error.message, error);
    }

    isValid(): boolean {
        return this.success;
    }

    getErrorMessage(): string {
        return this.errorMessage || "Unknown error";
    }
}