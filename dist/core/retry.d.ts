export interface RetryOptions {
    maxAttempts?: number;
    initialDelaySeconds?: number;
    backoffFactor?: number;
    onRetry?: (attempt: number, delaySeconds: number, error: any) => void;
}
export declare class RetryHandler {
    /**
     * Menjalankan fungsi async dengan auto-retry dan countdown timer interaktif di terminal.
     * Langsung merefleksikan catatan sketsa:
     * "kalau server error / sibuk bisa retrying to connect, sambil ada waktunya"
     */
    static executeWithCountdown<T>(operation: () => Promise<T>, options?: RetryOptions): Promise<T>;
    private static sleep;
}
