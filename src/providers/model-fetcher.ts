import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { ApiKeyEntry, ConfigManager } from '../core/config.js';

export interface ProviderModel {
  id: string;
  name: string;
  description?: string;
}

export class ModelFetcher {
  private static cacheFile = path.join(os.homedir(), '.tempe', 'models-cache.json');

  public static loadCache(): Record<string, ProviderModel[]> {
    ConfigManager.ensureDir();
    if (!fs.existsSync(this.cacheFile)) return {};
    try {
      return JSON.parse(fs.readFileSync(this.cacheFile, 'utf-8'));
    } catch {
      return {};
    }
  }

  public static saveCache(cache: Record<string, ProviderModel[]>): void {
    ConfigManager.ensureDir();
    fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
  }

  /**
   * Mengambil daftar model riil langsung dari API provider yang sedang aktif.
   */
  public static async getModelsForProvider(
    keyEntry: ApiKeyEntry,
    forceRefresh: boolean = false
  ): Promise<ProviderModel[]> {
    const cacheKey = `${keyEntry.provider}_${keyEntry.id}`;
    const cache = this.loadCache();

    if (!forceRefresh && cache[cacheKey] && cache[cacheKey].length > 0) {
      return cache[cacheKey];
    }

    try {
      let models: ProviderModel[] = [];

      // 1. Google Gemini Provider
      if (keyEntry.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${keyEntry.key}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models)) {
            models = data.models
              .filter((m: any) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
              .map((m: any) => ({
                id: m.name.replace(/^models\//, ''),
                name: m.displayName || m.name.replace(/^models\//, ''),
                description: m.description ? m.description.slice(0, 80) + '...' : undefined,
              }));
          }
        }
      }

      // 2. OpenAI / Groq / OpenAI-Compatible / Custom Endpoint
      else if (keyEntry.provider === 'openai' || keyEntry.provider === 'groq' || keyEntry.provider === 'custom') {
        let base = keyEntry.baseUrl || (keyEntry.provider === 'groq' 
          ? 'https://api.groq.com/openai/v1' 
          : 'https://api.openai.com/v1');
        
        // Bersihkan tanda kurung siku jika ada, misal "[http://...]"
        base = base.replace(/[\[\]]/g, '').replace(/\/$/, '');
        if (base.endsWith('/chat/completions')) {
          base = base.replace('/chat/completions', '');
        }

        const url = `${base}/models`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${keyEntry.key}`,
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.data || []);
          models = list.map((m: any) => ({
            id: m.id || m.name,
            name: m.id || m.name,
            description: m.owned_by ? `Owned by ${m.owned_by}` : undefined,
          }));
        }
      }

      // 3. Ollama Provider
      else if (keyEntry.provider === 'ollama') {
        let base = (keyEntry.baseUrl || 'http://localhost:11434').replace(/[\[\]]/g, '').replace(/\/$/, '');
        const url = `${base}/api/tags`;
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.models)) {
            models = data.models.map((m: any) => ({
              id: m.name,
              name: m.name,
              description: `Size: ${Math.round((m.size || 0) / (1024 * 1024))} MB`,
            }));
          }
        }
      }

      // 4. Anthropic Claude Provider
      else if (keyEntry.provider === 'anthropic') {
        const url = 'https://api.anthropic.com/v1/models';
        const res = await fetch(url, {
          headers: {
            'x-api-key': keyEntry.key,
            'anthropic-version': '2023-06-01',
          },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data)) {
            models = data.data.map((m: any) => ({
              id: m.id,
              name: m.display_name || m.id,
              description: m.created_at,
            }));
          }
        }
      }

      if (models.length > 0) {
        // Prioritaskan model flash/pro/coding di urutan awal jika ada
        models.sort((a, b) => {
          const aId = a.id.toLowerCase();
          const bId = b.id.toLowerCase();
          if (aId.includes('flash') && !bId.includes('flash')) return -1;
          if (!aId.includes('flash') && bId.includes('flash')) return 1;
          return aId.localeCompare(bId);
        });

        cache[cacheKey] = models;
        this.saveCache(cache);
        return models;
      }
    } catch {
      // Fallback jika pemanggilan jaringan gagal
    }

    // Fallback default spesifik untuk provider jika gagal memanggil API
    return this.getDefaultFallbackModels(keyEntry.provider);
  }

  public static getDefaultFallbackModels(provider: ApiKeyEntry['provider']): ProviderModel[] {
    switch (provider) {
      case 'gemini':
        return [
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Kecepatan tinggi, multimodal, biaya hemat' },
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Penalaran kompleks & pengkodean mendalam' },
          { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', description: 'Rilis flash stabil terbaru' },
          { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', description: 'Generasi berikutnya dari Flash' },
          { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', description: 'Versi mutakhir performa tinggi' },
        ];
      case 'openai':
        return [
          { id: 'gpt-4o', name: 'GPT-4o', description: 'Model unggulan serbaguna' },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Cepat & efisien biaya' },
          { id: 'o1', name: 'OpenAI o1', description: 'Penalaran dan matematika tingkat tinggi' },
        ];
      case 'anthropic':
        return [
          { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Advanced Hybrid Reasoning & Coding' },
          { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: 'Super cepat dan efisien' },
        ];
      case 'groq':
        return [
          { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', description: 'Kecepatan inferensi ultra tinggi' },
          { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Context window 32k' },
        ];
      default:
        return [
          { id: 'default', name: 'Default Provider Model', description: 'Model bawaan dari endpoint API' },
        ];
    }
  }
}
