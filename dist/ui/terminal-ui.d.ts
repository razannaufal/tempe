export declare class TerminalUI {
    private currentMode;
    private currentState;
    private isRunning;
    constructor();
    start(): Promise<void>;
    private renderWelcome;
    private renderHeader;
    private mainPromptLoop;
    /**
     * Membaca input terminal dengan dukungan tombol keyboard:
     * - Left Arrow: Agent Mode
     * - Right Arrow: Plan Mode
     * - Alt+C: Menu Utama
     * - Escape: Interrupt
     */
    private readInputWithShortcuts;
}
