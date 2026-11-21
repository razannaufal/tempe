import { TerminalUI } from './ui/terminal-ui.js';
import { MenuHandler } from './ui/menu.js';
import { AgentLoop } from './agent/agent-loop.js';
import { UpdateChecker } from './core/updater.js';
import chalk from 'chalk';
export async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--install-notify') || args.includes('setup')) {
        UpdateChecker.printInstallSuccessBanner();
        return;
    }
    if (args.includes('--version') || args.includes('-v')) {
        console.log(`Tempe CLI v${UpdateChecker.CURRENT_VERSION}`);
        return;
    }
    if (args.includes('--help') || args.includes('-h')) {
        printHelp();
        return;
    }
    const firstArg = args[0]?.toLowerCase();
    if (firstArg === 'usage') {
        const { UsageTracker } = await import('./core/usage.js');
        console.log('\n' + UsageTracker.renderUsageReport() + '\n');
        return;
    }
    if (firstArg === 'models') {
        await MenuHandler.handleModelsMenu();
        return;
    }
    if (firstArg === 'history') {
        const { HistoryManager } = await import('./core/history.js');
        console.log('\n' + HistoryManager.renderList(15) + '\n');
        return;
    }
    if (firstArg === 'api') {
        await MenuHandler.handleApiMenu();
        return;
    }
    if (firstArg === 'plan') {
        const prompt = args.slice(1).join(' ');
        if (!prompt) {
            console.log(chalk.red('Gunakan: tempe plan "<tugas/rencana yang ingin dibuat>"'));
            return;
        }
        await AgentLoop.execute(prompt, 'plan');
        return;
    }
    if (firstArg === 'agent') {
        const prompt = args.slice(1).join(' ');
        if (!prompt) {
            console.log(chalk.red('Gunakan: tempe agent "<tugas/aksi yang ingin dijalankan>"'));
            return;
        }
        await AgentLoop.execute(prompt, 'agent');
        return;
    }
    // Default: interactive terminal UI
    const ui = new TerminalUI();
    await ui.start();
}
function printHelp() {
    console.log(`
${chalk.bold.hex('#F59E0B')('TEMPE CLI')} - Terminal AI Coding Agent v${UpdateChecker.CURRENT_VERSION}

${chalk.bold('PENGGUNAAN:')}
  ${chalk.cyan('tempe')}                  Memulai antarmuka terminal interaktif
  ${chalk.cyan('tempe plan "<prompt>"')}  Menjalankan perintah langsung dalam Plan Mode (Ungu)
  ${chalk.cyan('tempe agent "<prompt>"')} Menjalankan perintah langsung dalam Agent Mode (Tosca)
  ${chalk.cyan('tempe usage')}            Melihat % pemakaian kuota, token, dan estimasi tagihan ($)
  ${chalk.cyan('tempe models')}           Melihat dan mengganti model AI
  ${chalk.cyan('tempe history')}          Melihat riwayat percakapan sesi sebelumnya
  ${chalk.cyan('tempe api')}              Mengelola multi-API key (OpenAI, Gemini, Claude, Groq, Ollama)

${chalk.bold('NAVIGASI & SHORTCUT DI DALAM CLI:')}
  ${chalk.yellow('<-')}                    Beralih ke Agent Mode (Hijau Tosca)
  ${chalk.yellow('->')}                    Beralih ke Plan Mode (Ungu)
  ${chalk.yellow('alt + c')}               Membuka Menu Utama
  ${chalk.yellow('esc')}                   Interrupt / membatalkan respon atau aksi yang sedang berjalan

${chalk.bold('DOKUMENTASI & KONTRIBUSI:')}
  Repositori:  https://github.com/tempe-ai/tempe
  Web & Docs:  https://tempe-ai.github.io
`);
}
