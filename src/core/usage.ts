import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { ConfigManager } from './config.js';

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

// Per 1M tokens pricing estimation (Input / Output USD)
const MODEL_PRICING: Record<string, { inputPer1M: number; outputPer1M: number }> = {
  'gemini-2.5-flash': { inputPer1M: 0.075, outputPer1M: 0.30 },
  'gemini-2.5-pro': { inputPer1M: 1.25, outputPer1M: 5.00 },
  'gpt-4o': { inputPer1M: 2.50, outputPer1M: 10.00 },
  'gpt-4o-mini': { inputPer1M: 0.15, outputPer1M: 0.60 },
  'claude-3-7-sonnet': { inputPer1M: 3.00, outputPer1M: 15.00 },
  'claude-3-5-haiku': { inputPer1M: 0.80, outputPer1M: 4.00 },
  'deepseek-r1': { inputPer1M: 0.55, outputPer1M: 2.19 },
  'groq-llama-3.3-70b': { inputPer1M: 0.59, outputPer1M: 0.79 },
  'ollama-local': { inputPer1M: 0.0, outputPer1M: 0.0 },
};

export class UsageTracker {
  private static usageFile = path.join(os.homedir(), '.tempe', 'usage.json');

  public static load(): UsageStore {
    ConfigManager.ensureDir();
    if (!fs.existsSync(this.usageFile)) {
      const initial: UsageStore = {
        totalTokens: 0,
        totalCostUsd: 0,
        byModel: {},
      };
      this.save(initial);
      return initial;
    }
    try {
      const raw = fs.readFileSync(this.usageFile, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return { totalTokens: 0, totalCostUsd: 0, byModel: {} };
    }
  }

  public static save(data: UsageStore): void {
    ConfigManager.ensureDir();
    fs.writeFileSync(this.usageFile, JSON.stringify(data, null, 2), 'utf-8');
  }

  public static recordUsage(model: string, promptTokens: number, completionTokens: number): void {
    const store = this.load();
    const pricing = MODEL_PRICING[model] || { inputPer1M: 0.5, outputPer1M: 1.5 };
    const cost = (promptTokens * pricing.inputPer1M + completionTokens * pricing.outputPer1M) / 1_000_000;

    const total = promptTokens + completionTokens;
    store.totalTokens += total;
    store.totalCostUsd += cost;

    if (!store.byModel[model]) {
      store.byModel[model] = {
        modelName: model,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        callCount: 0,
        estimatedCostUsd: 0,
        lastUsed: new Date().toISOString(),
      };
    }

    const m = store.byModel[model];
    m.promptTokens += promptTokens;
    m.completionTokens += completionTokens;
    m.totalTokens += total;
    m.callCount += 1;
    m.estimatedCostUsd += cost;
    m.lastUsed = new Date().toISOString();

    this.save(store);
  }

  public static renderUsageReport(selectedModel?: string): string {
    const store = this.load();
    const config = ConfigManager.load();
    const limit = config.quotaLimitUsd || 10.0;
    const percentage = Math.min(100, (store.totalCostUsd / limit) * 100);

    const barLength = 24;
    const filled = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    const color = percentage > 80 ? chalk.red : percentage > 50 ? chalk.yellow : chalk.green;

    const lines: string[] = [];
    lines.push(chalk.bold.hex('#F59E0B')('📊 TEMPE USAGE & TOKEN MONITOR'));
    lines.push(chalk.gray('─'.repeat(54)));
    lines.push(`Total Tagihan (Bill $):  ${chalk.bold.white('$' + store.totalCostUsd.toFixed(4))} / $${limit.toFixed(2)}`);
    lines.push(`Persentase Pemakaian:    ${color(percentage.toFixed(1) + '%')} [${color(bar)}]`);
    lines.push(`Total Token Dipakai:     ${chalk.bold.cyan(store.totalTokens.toLocaleString())} tokens`);
    lines.push(chalk.gray('─'.repeat(54)));

    const models = Object.keys(store.byModel);
    if (models.length === 0) {
      lines.push(chalk.gray('Belum ada pemakaian model yang tercatat.'));
    } else {
      lines.push(chalk.bold('Pilihan Riwayat Model yang Sudah Dipakai:'));
      for (const mKey of models) {
        const item = store.byModel[mKey];
        const isCurrent = (selectedModel && selectedModel === mKey) ? chalk.green(' [Dipilih]') : '';
        lines.push(`\n  ${chalk.bold.hex('#38BDF8')(item.modelName)}${isCurrent}`);
        lines.push(`  ├─ Total Tokens: ${item.totalTokens.toLocaleString()} (${item.promptTokens.toLocaleString()} in / ${item.completionTokens.toLocaleString()} out)`);
        lines.push(`  ├─ Total Calls:  ${item.callCount} kali`);
        lines.push(`  └─ Bill ($):     ${chalk.yellow('$' + item.estimatedCostUsd.toFixed(4))}`);
      }
    }
    lines.push(chalk.gray('─'.repeat(54)));
    lines.push(chalk.gray('Tips: Ubah batas kuota di ~/.tempe/config.json'));

    return lines.join('\n');
  }
}
