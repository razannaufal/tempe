import fs from 'fs';
import path from 'path';
import os from 'os';

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

const DEFAULT_CONFIG: TempeConfig = {
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
  private static configDir = path.join(os.homedir(), '.tempe');
  private static configFile = path.join(os.homedir(), '.tempe', 'config.json');

  public static ensureDir(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  public static load(): TempeConfig {
    this.ensureDir();
    if (!fs.existsSync(this.configFile)) {
      this.save(DEFAULT_CONFIG);
      return { ...DEFAULT_CONFIG };
    }
    try {
      const raw = fs.readFileSync(this.configFile, 'utf-8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  public static save(config: TempeConfig): void {
    this.ensureDir();
    fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2), 'utf-8');
  }

  public static getActiveApiKey(config: TempeConfig): ApiKeyEntry | undefined {
    return config.apiKeys.find(k => k.isDefault) || config.apiKeys[0];
  }

  public static addApiKey(
    label: string,
    provider: ApiKeyEntry['provider'],
    key: string,
    baseUrl?: string,
    model?: string
  ): ApiKeyEntry {
    const config = this.load();
    const isFirst = config.apiKeys.length === 0;

    const newKey: ApiKeyEntry = {
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

  public static setDefaultApiKey(id: string): boolean {
    const config = this.load();
    let found = false;
    config.apiKeys = config.apiKeys.map(k => {
      if (k.id === id) {
        found = true;
        return { ...k, isDefault: true };
      }
      return { ...k, isDefault: false };
    });
    if (found) this.save(config);
    return found;
  }

  public static removeApiKey(id: string): boolean {
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

  public static setMode(mode: 'plan' | 'agent'): void {
    const config = this.load();
    config.currentMode = mode;
    this.save(config);
  }

  public static setModel(model: string): void {
    const config = this.load();
    config.defaultModel = model;
    this.save(config);
  }
}
