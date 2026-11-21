export type AppMode = 'plan' | 'agent' | 'normal';
export interface ThemeColors {
    primary: (text: string) => string;
    primaryBg: (text: string) => string;
    border: (text: string) => string;
    tag: string;
    name: string;
}
export declare class ThemeManager {
    /**
     * Warna sesuai coretan sketsa & spesifikasi:
     * - Plan Mode: Ungu (now: Plan)
     * - Agent Mode: Hijau Tosca
     * - Normal: Putih / Hitam
     */
    static getTheme(mode: AppMode): ThemeColors;
    /**
     * Header kotak interaktif seperti pada sketsa buku catatan:
     * [                                     ] now: plan
     * agent <- -> plan   alt+c: menu
     */
    static renderHeader(mode: AppMode, stateLabel?: string): string;
    /**
     * Box container untuk menampilkan output atau pesan
     */
    static box(content: string, title?: string, mode?: AppMode): string;
}
