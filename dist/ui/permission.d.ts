export type PermissionDecision = 'always' | 'allow_once' | 'not_allow';
export declare class PermissionManager {
    private static sessionAlwaysAllowed;
    static isAlwaysAllowed(): boolean;
    static resetSession(): void;
    /**
     * Menampilkan dialog konfirmasi perizinan aksi sesuai gambar sketsa:
     * [1] always allow
     * [2] allow once
     * [3] not allow
     */
    static requestPermission(actionName: string, detail: string): Promise<boolean>;
    private static askChoice;
}
