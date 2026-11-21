import fs from 'fs';
import path from 'path';
import os from 'os';
const DEFAULT_CONFIG = {
    version: '1.0.0',
    currentMode: 'plan',
    defaultModel: 'gemini-2.5-flash',
    themePreference: 'auto',
    apiKeys: [],
    quotaLimitUsd: 10.0,
    autoLanguage: true,
    permissionPolicy: 'ask',
};
export class ConfigManager {
    static configDir = path.join(os.homedir(), '.tempe');
    static configFile = path.join(os.homedir(), '.tempe', 'config.json');
    static ensureDir() {
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
        }
    }
    static load() {
        this.ensureDir();
        if (!fs.existsSync(this.configFile)) {
            this.save(DEFAULT_CONFIG);
            return { ...DEFAULT_CONFIG };
        }
        try {
            const raw = fs.readFileSync(this.configFile, 'utf-8');
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_CONFIG, ...parsed };
        }
        catch {
            return { ...DEFAULT_CONFIG };
        }
    }
    static save(config) {
        this.ensureDir();
        fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2), 'utf-8');
    }
    static getActiveApiKey(config) {
        return config.apiKeys.find(k => k.isDefault) || config.apiKeys[0];
    }
    static addApiKey(label, provider, key, baseUrl, model) {
        const config = this.load();
        const isFirst = config.apiKeys.length === 0;
        const newKey = {
            id: 'key_' + Date.now().toString(36),
            label: label || `${provider}-${config.apiKeys.length + 1}`,
            provider,
            key,
            baseUrl: baseUrl || undefined,
            model: model || undefined,
            isDefault: isFirst,
            createdAt: new Date().toISOString(),
        };
        config.apiKeys.push(newKey);
        this.save(config);
        return newKey;
    }
    static setDefaultApiKey(id) {
        const config = this.load();
        let found = false;
        config.apiKeys = config.apiKeys.map(k => {
            if (k.id === id) {
                found = true;
                return { ...k, isDefault: true };
            }
            return { ...k, isDefault: false };
        });
        if (found)
            this.save(config);
        return found;
    }
    static removeApiKey(id) {
        const config = this.load();
        const initialLen = config.apiKeys.length;
        config.apiKeys = config.apiKeys.filter(k => k.id !== id);
        if (config.apiKeys.length < initialLen) {
            if (config.apiKeys.length > 0 && !config.apiKeys.some(k => k.isDefault)) {
                config.apiKeys[0].isDefault = true;
            }
            this.save(config);
            return true;
        }
        return false;
    }
    static setMode(mode) {
        const config = this.load();
        config.currentMode = mode;
        this.save(config);
    }
    static setModel(model) {
        const config = this.load();
        config.defaultModel = model;
        this.save(config);
    }
}
