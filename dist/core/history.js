import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { ConfigManager } from './config.js';
export class HistoryManager {
    static historyFile = path.join(os.homedir(), '.tempe', 'history.json');
    static load() {
        ConfigManager.ensureDir();
        if (!fs.existsSync(this.historyFile)) {
            return [];
        }
        try {
            const raw = fs.readFileSync(this.historyFile, 'utf-8');
            return JSON.parse(raw);
        }
        catch {
            return [];
        }
    }
    static add(item) {
        const list = this.load();
        const newItem = {
            ...item,
            id: 'h_' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
        };
        list.unshift(newItem); // newest first
        // Limit to latest 100 entries
        if (list.length > 100)
            list.pop();
        ConfigManager.ensureDir();
        fs.writeFileSync(this.historyFile, JSON.stringify(list, null, 2), 'utf-8');
        return newItem;
    }
    static clear() {
        ConfigManager.ensureDir();
        fs.writeFileSync(this.historyFile, JSON.stringify([], null, 2), 'utf-8');
    }
    static renderList(limit = 10) {
        const list = this.load();
        if (list.length === 0) {
            return chalk.gray('Belum ada riwayat percakapan yang tersimpan.');
        }
        const lines = [];
        lines.push(chalk.bold.hex('#F59E0B')(`📜 RIWAYAT SESI TEMPE (Menampilkan ${Math.min(limit, list.length)} sesi terakhir)`));
        lines.push(chalk.gray('─'.repeat(58)));
        list.slice(0, limit).forEach((item, idx) => {
            const date = new Date(item.timestamp).toLocaleString();
            const modeBadge = item.mode === 'plan'
                ? chalk.bgHex('#7E22CE').white.bold(' PLAN ')
                : chalk.bgHex('#0F766E').white.bold(' AGENT ');
            const snippet = item.prompt.replace(/\n/g, ' ').slice(0, 60) + (item.prompt.length > 60 ? '...' : '');
            lines.push(`${chalk.gray(`[${idx + 1}]`)} ${modeBadge} ${chalk.bold.white(snippet)}`);
            lines.push(`    ${chalk.gray('Waktu:')} ${chalk.gray(date)}  |  ${chalk.gray('Model:')} ${chalk.cyan(item.model)}`);
            if (item.toolsUsed && item.toolsUsed.length > 0) {
                lines.push(`    ${chalk.gray('Tools:')} ${chalk.yellow(item.toolsUsed.join(', '))}`);
            }
            lines.push('');
        });
        lines.push(chalk.gray('─'.repeat(58)));
        return lines.join('\n');
    }
}
