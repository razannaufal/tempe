export declare class MenuHandler {
    /**
     * Menampilkan menu utama tempe (dibuka dengan alt+c atau mengetik 'menu')
     */
    static openMainMenu(): Promise<'continue' | 'exit'>;
    /**
     * Menu: Usage
     */
    static handleUsageMenu(): Promise<void>;
    /**
     * Menu: Models — mengambil daftar model RIIL dari API provider yang aktif
     */
    static handleModelsMenu(): Promise<void>;
    /**
     * Menu: History
     */
    static handleHistoryMenu(): Promise<void>;
    /**
     * Menu: API Key Manager (> 1 API Key)
     */
    static handleApiMenu(): Promise<void>;
    /**
     * Menu: Theme
     */
    static handleThemeMenu(): Promise<void>;
    private static ask;
}
