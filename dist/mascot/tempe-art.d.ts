export type TempeState = 'unready' | 'needs_repo' | 'agent_working' | 'mateng_shining' | 'angry' | 'idle';
export interface TempeMascotOptions {
    state: TempeState;
    showArt?: boolean;
}
export declare class TempeMascot {
    /**
     * Menghasilkan ASCII art karakter tempe sesuai dengan status dinamisnya.
     * Terinspirasi langsung dari coretan sketsa:
     * - "kalau belum siap tempenya belum sempurna bentuknya"
     * - "tempenya bakal jadi mateng kl udah jadi -> ada sinar di ujung"
     * - "kl butuh akses ke repo tempe logonya jadi ada tanda tanya ?"
     * - "kondisi marah bila melewati batas"
     */
    static getMascotArt(state: TempeState): string;
    /**
     * Compact badge icon untuk status bar atau prompt
     */
    static getBadge(state: TempeState): string;
}
