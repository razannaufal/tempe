import { TempeState } from '../mascot/tempe-art.js';
export declare class AgentLoop {
    private static isInterrupted;
    static interrupt(): void;
    static resetInterrupt(): void;
    /**
     * Menjalankan siklus eksekusi AI coding agent
     */
    static execute(userPrompt: string, mode: 'plan' | 'agent', onStateChange?: (state: TempeState) => void): Promise<void>;
}
