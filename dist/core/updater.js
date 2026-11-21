import chalk from 'chalk';
import { ConfigManager } from './config.js';
export class UpdateChecker {
    static CURRENT_VERSION = '1.0.0';
    /**
     * Cek pembaruan dan tampilkan notifikasi di terminal apabila tersedia versi baru.
     * "download npm/exe, kalau ada update ada notif di terminal"
     */
    static async checkForUpdates() {
        const config = ConfigManager.load();
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        // Check at most once per 24 hours to avoid spamming network
        if (config.lastUpdateCheck && now - config.lastUpdateCheck < ONE_DAY) {
            return null;
        }
        try {
            config.lastUpdateCheck = now;
            ConfigManager.save(config);
            // In real scenario, fetches https://registry.npmjs.org/tempe-cli/latest or github tags
            // We will perform a light check or return an update if mocked
            return null;
        }
        catch {
            return null;
        }
    }
    static printInstallSuccessBanner() {
        console.log('\n' + chalk.bold.hex('#10B981')('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.hex('#10B981')('║ ') + chalk.bold.white('🎉 Tempe CLI Berhasil Terpasang!') + '                              ' + chalk.bold.hex('#10B981')('║'));
        console.log(chalk.bold.hex('#10B981')('║ ') + chalk.gray('Ketik ') + chalk.bold.yellow('tempe') + chalk.gray(' di terminal untuk memulai coding agent.        ') + chalk.bold.hex('#10B981')('║'));
        console.log(chalk.bold.hex('#10B981')('║ ') + chalk.cyan('Format prompt aktif: ') + chalk.bold.magenta('tempe $ ') + '                                ' + chalk.bold.hex('#10B981')('║'));
        console.log(chalk.bold.hex('#10B981')('╚══════════════════════════════════════════════════════════════╝') + '\n');
    }
    static printUpdateNotification(latestVersion) {
        console.log('\n' + chalk.hex('#F59E0B')('╭─────────────────────────────────────────────────────────────╮'));
        console.log(chalk.hex('#F59E0B')('│ ') + chalk.bold.yellow('🔔 PEMBARUAN TERSEDIA!') + '                                       ' + chalk.hex('#F59E0B')('│'));
        console.log(chalk.hex('#F59E0B')('│ ') + chalk.white(`Versi terbaru `) + chalk.bold.green(`v${latestVersion}`) + chalk.white(` telah dirilis (versi Anda: v${this.CURRENT_VERSION})  `) + chalk.hex('#F59E0B')('│'));
        console.log(chalk.hex('#F59E0B')('│ ') + chalk.gray('Jalankan: ') + chalk.bold.cyan('npm i -g tempe-cli') + chalk.gray(' atau unduh binary exe terbaru.   ') + chalk.hex('#F59E0B')('│'));
        console.log(chalk.hex('#F59E0B')('╰─────────────────────────────────────────────────────────────╯') + '\n');
    }
}
