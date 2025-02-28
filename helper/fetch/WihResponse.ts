export class WihResponse<T> {
    private readonly errorMessage?: string;

    readonly status: number;
    readonly success: boolean;
    readonly data?: T;
    readonly error?: Error;

    private constructor(status: number, success: boolean, data?: T, errorMessage?: string, error?: Error) {
        this.status = status;
        this.success = success;
        this.data = data;
        this.errorMessage = errorMessage;
        this.error = error;
    }

    static async fromResponse<T>(response: Response): Promise<WihResponse<T>> {
        if (response.ok) {
            const data = await response.json();
            return new WihResponse<T>(response.status, true, data);
        }

        const errorText = await response.text();
        return new WihResponse<T>(response.status, false, undefined, errorText || response.statusText);
    }

    static fail<T>(errorMessage: string, status: number = 400): WihResponse<T> {
        return new WihResponse<T>(status, false, undefined, errorMessage);
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