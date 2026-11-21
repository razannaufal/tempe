export interface ModelUsageStats {
    modelName: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    callCount: number;
    estimatedCostUsd: number;
    lastUsed: string;
}
export interface UsageStore {
    totalTokens: number;
    totalCostUsd: number;
    byModel: Record<string, ModelUsageStats>;
}
export declare class UsageTracker {
    private static usageFile;
    static load(): UsageStore;
    static save(data: UsageStore): void;
    static recordUsage(model: string, promptTokens: number, completionTokens: number): void;
    static renderUsageReport(selectedModel?: string): string;
}
