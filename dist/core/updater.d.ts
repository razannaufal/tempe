export declare class UpdateChecker {
    static readonly CURRENT_VERSION = "1.0.0";
    /**
     * Cek pembaruan dan tampilkan notifikasi di terminal apabila tersedia versi baru.
     * "download npm/exe, kalau ada update ada notif di terminal"
     */
    static checkForUpdates(): Promise<string | null>;
    static printInstallSuccessBanner(): void;
    static printUpdateNotification(latestVersion: string): void;
}
