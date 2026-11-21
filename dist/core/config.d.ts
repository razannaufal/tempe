export interface ApiKeyEntry {
    id: string;
    label: string;
    provider: 'openai' | 'gemini' | 'anthropic' | 'groq' | 'ollama' | 'custom';
    key: string;
    baseUrl?: string;
    model?: string;
    isDefault: boolean;
    createdAt: string;
}
export interface TempeConfig {
    version: string;
    currentMode: 'plan' | 'agent';
    defaultModel: string;
    themePreference: 'auto' | 'purple' | 'tosca' | 'monochrome';
    apiKeys: ApiKeyEntry[];
    quotaLimitUsd: number;
    autoLanguage: boolean;
    permissionPolicy: 'ask' | 'always';
    lastUpdateCheck?: number;
}
export declare class ConfigManager {
    private static configDir;
    private static configFile;
    static ensureDir(): void;
    static load(): TempeConfig;
    static save(config: TempeConfig): void;
    static getActiveApiKey(config: TempeConfig): ApiKeyEntry | undefined;
    static addApiKey(label: string, provider: ApiKeyEntry['provider'], key: string, baseUrl?: string, model?: string): ApiKeyEntry;
    static setDefaultApiKey(id: string): boolean;
    static removeApiKey(id: string): boolean;
    static setMode(mode: 'plan' | 'agent'): void;
    static setModel(model: string): void;
}
