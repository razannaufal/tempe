import { ApiKeyEntry } from '../core/config.js';
export interface ProviderModel {
    id: string;
    name: string;
    description?: string;
}
export declare class ModelFetcher {
    private static cacheFile;
    static loadCache(): Record<string, ProviderModel[]>;
    static saveCache(cache: Record<string, ProviderModel[]>): void;
    /**
     * Mengambil daftar model riil langsung dari API provider yang sedang aktif.
     */
    static getModelsForProvider(keyEntry: ApiKeyEntry, forceRefresh?: boolean): Promise<ProviderModel[]>;
    static getDefaultFallbackModels(provider: ApiKeyEntry['provider']): ProviderModel[];
}
