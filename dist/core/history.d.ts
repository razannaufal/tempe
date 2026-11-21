export interface HistoryItem {
    id: string;
    timestamp: string;
    mode: 'plan' | 'agent';
    model: string;
    prompt: string;
    response: string;
    toolsUsed?: string[];
    tokens?: number;
}
export declare class HistoryManager {
    private static historyFile;
    static load(): HistoryItem[];
    static add(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem;
    static clear(): void;
    static renderList(limit?: number): string;
}
