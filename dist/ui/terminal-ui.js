import readline from 'readline';
import chalk from 'chalk';
import { ConfigManager } from '../core/config.js';
import { TempeMascot } from '../mascot/tempe-art.js';
import { ThemeManager } from './theme.js';
import { MenuHandler } from './menu.js';
import { AgentLoop } from '../agent/agent-loop.js';
import { UpdateChecker } from '../core/updater.js';
export class TerminalUI {
    currentMode = 'plan';
    currentState = 'idle';
    isRunning = true;
    constructor() {
        const config = ConfigManager.load();
        this.currentMode = config.currentMode || 'plan';
        // Cek apakah sudah ada API key
        if (config.apiKeys.length === 0) {
            this.currentState = 'needs_repo';
        }
    }
    async start() {
        // 1. Tampilkan ucapan selamat datang & header tempe
        console.clear();
        this.renderWelcome();
        // 2. Cek update di background (unobtrusive)
        UpdateChecker.checkForUpdates().then(updateVersion => {
            if (updateVersion) {
                UpdateChecker.printUpdateNotification(updateVersion);
            }
        });
        // 3. Masuk ke interactive loop
        await this.mainPromptLoop();
    }
    renderWelcome() {
        console.log(TempeMascot.getMascotArt(this.currentState));
        console.log('\n' + chalk.bold.white('Selamat datang di ') + chalk.bold.hex('#F59E0B')('Tempe CLI') + chalk.gray(' - Terminal AI Coding Agent\n'));
        console.log(chalk.gray('Petunjuk Navigasi:'));
        console.log('  ' + chalk.cyan('<-') + '        : Beralih ke ' + chalk.bold.hex('#14B8A6')('Agent Mode') + chalk.gray(' (Hijau Tosca)'));
        console.log('  ' + chalk.hex('#A855F7')('->') + '        : Beralih ke ' + chalk.bold.hex('#A855F7')('Plan Mode') + chalk.gray(' (Ungu)'));
        console.log('  ' + chalk.hex('#F59E0B')('alt + c') + '   : Buka ' + chalk.bold('Menu Utama') + chalk.gray(' (Usage, Models, History, API, Theme)'));
        console.log('  ' + chalk.red('esc') + '       : ' + chalk.bold('Interrupt') + chalk.gray(' / batalkan proses yang sedang berjalan\n'));
    }
    renderHeader() {
        const stateBadge = TempeMascot.getBadge(this.currentState);
        console.log('\n' + ThemeManager.renderHeader(this.currentMode, stateBadge));
    }
    async mainPromptLoop() {
        while (this.isRunning) {
            this.renderHeader();
            const promptAnswer = await this.readInputWithShortcuts();
            if (!promptAnswer)
                continue;
            const trimmed = promptAnswer.trim();
            // Perintah dasar / shortcut teks
            if (trimmed === 'exit' || trimmed === 'quit' || trimmed === ':q') {
                console.log(chalk.gray('Sampai jumpa! Terima kasih telah menggunakan Tempe CLI.'));
                this.isRunning = false;
                break;
            }
            if (trimmed === 'clear' || trimmed === 'cls') {
                console.clear();
                continue;
            }
            if (trimmed === 'menu') {
                await MenuHandler.openMainMenu();
                continue;
            }
            if (trimmed === 'usage') {
                await MenuHandler.handleUsageMenu();
                continue;
            }
            if (trimmed === 'models') {
                await MenuHandler.handleModelsMenu();
                continue;
            }
            if (trimmed === 'history') {
                await MenuHandler.handleHistoryMenu();
                continue;
            }
            if (trimmed === 'api' || trimmed.startsWith('api ')) {
                await MenuHandler.handleApiMenu();
                // Update state jika API key sudah ditambahkan
                const updatedConfig = ConfigManager.load();
                if (updatedConfig.apiKeys.length > 0 && this.currentState === 'needs_repo') {
                    this.currentState = 'idle';
                }
                continue;
            }
            if (trimmed === 'theme') {
                await MenuHandler.handleThemeMenu();
                continue;
            }
            if (trimmed === 'plan' || trimmed === '->') {
                this.currentMode = 'plan';
                ConfigManager.setMode('plan');
                console.log(chalk.hex('#A855F7')('✓ Beralih ke Plan Mode (Ungu).'));
                continue;
            }
            if (trimmed === 'agent' || trimmed === '<-') {
                this.currentMode = 'agent';
                ConfigManager.setMode('agent');
                console.log(chalk.hex('#14B8A6')('✓ Beralih ke Agent Mode (Hijau Tosca).'));
                continue;
            }
            // Jalankan agent loop
            await AgentLoop.execute(trimmed, this.currentMode, newState => {
                this.currentState = newState;
            });
        }
    }
    /**
     * Membaca input terminal dengan dukungan tombol keyboard:
     * - Left Arrow: Agent Mode
     * - Right Arrow: Plan Mode
     * - Alt+C: Menu Utama
     * - Escape: Interrupt
     */
    readInputWithShortcuts() {
        return new Promise(resolve => {
            const modeColor = this.currentMode === 'plan' ? chalk.hex('#A855F7') : chalk.hex('#14B8A6');
            const promptString = `${chalk.bold('tempe')} ${modeColor('$')} `;
            process.stdout.write(promptString);
            // Raw mode untuk mendeteksi keypress
            if (process.stdin.isTTY) {
                readline.emitKeypressEvents(process.stdin);
                process.stdin.setRawMode(true);
                let inputBuffer = '';
                const onKeypress = async (str, key) => {
                    if (!key)
                        return;
                    // Ctrl+C -> keluar
                    if (key.ctrl && key.name === 'c') {
                        cleanup();
                        console.log('\n');
                        process.exit(0);
                    }
                    // Esc -> interrupt
                    if (key.name === 'escape') {
                        AgentLoop.interrupt();
                        console.log(chalk.red('\n[ESC Interrupt]'));
                        cleanup();
                        resolve('');
                        return;
                    }
                    // Alt + C -> Buka Menu
                    if (key.meta && (key.name === 'c' || str === 'c' || str === 'ç')) {
                        cleanup();
                        console.log('\n');
                        await MenuHandler.openMainMenu();
                        resolve('');
                        return;
                    }
                    // Left arrow -> switch to Agent mode (jika buffer kosong)
                    if (key.name === 'left' && inputBuffer.length === 0) {
                        this.currentMode = 'agent';
                        ConfigManager.setMode('agent');
                        cleanup();
                        console.log(chalk.hex('#14B8A6')('\n[<- Mode: Agent (Hijau Tosca)]'));
                        resolve('');
                        return;
                    }
                    // Right arrow -> switch to Plan mode (jika buffer kosong)
                    if (key.name === 'right' && inputBuffer.length === 0) {
                        this.currentMode = 'plan';
                        ConfigManager.setMode('plan');
                        cleanup();
                        console.log(chalk.hex('#A855F7')('\n[-> Mode: Plan (Ungu)]'));
                        resolve('');
                        return;
                    }
                    // Enter -> submit
                    if (key.name === 'return' || key.name === 'enter') {
                        cleanup();
                        console.log('\n');
                        resolve(inputBuffer);
                        return;
                    }
                    // Backspace
                    if (key.name === 'backspace') {
                        if (inputBuffer.length > 0) {
                            inputBuffer = inputBuffer.slice(0, -1);
                            process.stdout.write('\b \b');
                        }
                        return;
                    }
                    // Regular printable characters
                    if (str && str.length === 1 && !key.ctrl && !key.meta) {
                        inputBuffer += str;
                        process.stdout.write(str);
                    }
                };
                const cleanup = () => {
                    process.stdin.removeListener('keypress', onKeypress);
                    if (process.stdin.isTTY) {
                        process.stdin.setRawMode(false);
                    }
                };
                process.stdin.on('keypress', onKeypress);
            }
            else {
                // Fallback untuk non-TTY (misal piped input)
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question('', answer => {
                    rl.close();
                    resolve(answer);
                });
            }
        });
    }
}
