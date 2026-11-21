import readline from 'readline';
import chalk from 'chalk';
import { ConfigManager } from '../core/config.js';
import { UsageTracker } from '../core/usage.js';
import { HistoryManager } from '../core/history.js';
import { ModelFetcher } from '../providers/model-fetcher.js';
export class MenuHandler {
    /**
     * Menampilkan menu utama tempe (dibuka dengan alt+c atau mengetik 'menu')
     */
    static async openMainMenu() {
        console.log('\n' + chalk.bold.hex('#F59E0B')('╔══════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.bold.white('🍱 TEMPE MAIN MENU (alt+c)') + '                                  ' + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('╠══════════════════════════════════════════════════════════════╣'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.cyan(' [1] Usage   ') + chalk.gray('-> Cek % kuota, token, dan estimasi tagihan ($)   ') + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.cyan(' [2] Models  ') + chalk.gray('-> Switch / ganti model AI                        ') + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.cyan(' [3] History ') + chalk.gray('-> Lihat riwayat sesi dan percakapan AI           ') + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.cyan(' [4] API     ') + chalk.gray('-> Tambah dan kelola multi-API key (> 1 API)      ') + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.cyan(' [5] Theme   ') + chalk.gray('-> Pengaturan tema (Ungu Plan / Tosca Agent)      ') + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('║ ') + chalk.gray(' [0] Kembali ') + chalk.gray('-> Tutup menu & lanjutkan chat                    ') + chalk.bold.hex('#F59E0B')('║'));
        console.log(chalk.bold.hex('#F59E0B')('╚══════════════════════════════════════════════════════════════╝'));
        const choice = await this.ask('Pilih menu [0-5]: ');
        switch (choice.trim()) {
            case '1':
            case 'usage':
                await this.handleUsageMenu();
                break;
            case '2':
            case 'models':
                await this.handleModelsMenu();
                break;
            case '3':
            case 'history':
                await this.handleHistoryMenu();
                break;
            case '4':
            case 'api':
                await this.handleApiMenu();
                break;
            case '5':
            case 'theme':
                await this.handleThemeMenu();
                break;
            case '0':
            default:
                console.log(chalk.gray('Kembali ke sesi chat.\n'));
                break;
        }
        return 'continue';
    }
    /**
     * Menu: Usage
     */
    static async handleUsageMenu() {
        console.log('\n' + UsageTracker.renderUsageReport());
        await this.ask('\nTekan [Enter] untuk kembali...');
    }
    /**
     * Menu: Models — mengambil daftar model RIIL dari API provider yang aktif
     */
    static async handleModelsMenu() {
        const config = ConfigManager.load();
        const activeKey = ConfigManager.getActiveApiKey(config);
        if (!activeKey) {
            console.log(chalk.yellow('\n⚠️  Belum ada API key. Tambahkan dulu via menu [4] API.\n'));
            return;
        }
        // Spinner sederhana saat fetch
        process.stdout.write(chalk.gray('\n⏳ Mengambil daftar model dari ') +
            chalk.cyan(activeKey.provider) +
            chalk.gray(' API'));
        const spinInterval = setInterval(() => process.stdout.write(chalk.gray('.')), 350);
        let models = [];
        try {
            models = await ModelFetcher.getModelsForProvider(activeKey);
        }
        finally {
            clearInterval(spinInterval);
            process.stdout.write('\n');
        }
        if (models.length === 0) {
            console.log(chalk.red('\n✗ Tidak ada model yang bisa diambil dari provider. Cek koneksi atau API key Anda.\n'));
            return;
        }
        // Tampilkan header
        console.log('\n' + chalk.bold.hex('#14B8A6')(`🎛️  DAFTAR MODEL TERSEDIA — ${activeKey.provider.toUpperCase()} (${activeKey.label})`));
        console.log(chalk.gray(`   Sumber: model riil langsung dari provider | Total: ${models.length} model\n`));
        console.log(chalk.gray('─'.repeat(66)));
        models.forEach((m, idx) => {
            const isActive = m.id === config.defaultModel;
            const num = chalk.gray(`[${String(idx + 1).padStart(2, ' ')}]`);
            const idLabel = isActive
                ? chalk.bold.hex('#10B981')(m.id)
                : chalk.bold.white(m.id);
            const badge = isActive ? chalk.bgHex('#065F46').white.bold(' AKTIF ') : '';
            const desc = m.description ? chalk.gray(`  ${m.description.slice(0, 55)}`) : '';
            console.log(`${num} ${idLabel} ${badge}`);
            if (m.name && m.name !== m.id) {
                console.log(`      ${chalk.hex('#94A3B8')(m.name)}${desc}`);
            }
            else if (desc) {
                console.log(`      ${desc}`);
            }
        });
        console.log(chalk.gray('─'.repeat(66)));
        console.log(chalk.gray('Tekan Enter untuk batal tanpa mengubah model.\n'));
        const choice = await this.ask(`Pilih nomor model [1-${models.length}]: `);
        const num = parseInt(choice.trim(), 10);
        if (!isNaN(num) && num >= 1 && num <= models.length) {
            const selected = models[num - 1];
            ConfigManager.setModel(selected.id);
            console.log(chalk.green(`\n✓ Model aktif diubah ke: `) +
                chalk.bold.hex('#10B981')(selected.id) +
                (selected.name && selected.name !== selected.id ? chalk.gray(` (${selected.name})`) : '') +
                '\n');
        }
        else {
            console.log(chalk.gray('Model tidak diubah.\n'));
        }
    }
    /**
     * Menu: History
     */
    static async handleHistoryMenu() {
        console.log('\n' + HistoryManager.renderList(15));
        const action = await this.ask('Opsi: [c] Clear riwayat, [Enter] Kembali: ');
        if (action.trim().toLowerCase() === 'c') {
            HistoryManager.clear();
            console.log(chalk.yellow('✓ Riwayat percakapan telah dibersihkan.\n'));
        }
    }
    /**
     * Menu: API Key Manager (> 1 API Key)
     */
    static async handleApiMenu() {
        const config = ConfigManager.load();
        console.log('\n' + chalk.bold.hex('#F59E0B')('🔑 MANAJEMEN MULTI-API KEY:'));
        if (config.apiKeys.length === 0) {
            console.log(chalk.yellow('Belum ada API key yang terdaftar.'));
        }
        else {
            config.apiKeys.forEach((k, idx) => {
                const def = k.isDefault ? chalk.green(' [DEFAULT/AKTIF]') : '';
                const maskedKey = k.key.slice(0, 4) + '...' + k.key.slice(-4);
                console.log(` [${idx + 1}] ${chalk.bold.white(k.label)} (${chalk.cyan(k.provider)})${def}`);
                console.log(`     Key: ${chalk.gray(maskedKey)} | Ditambahkan: ${chalk.gray(new Date(k.createdAt).toLocaleDateString())}`);
            });
        }
        console.log('\nOpsi API:');
        console.log(' [a] Tambah API Key Baru');
        console.log(' [d] Jadikan Default');
        console.log(' [r] Hapus API Key');
        console.log(' [Enter] Kembali');
        const action = await this.ask('Pilih opsi: ');
        const opt = action.trim().toLowerCase();
        if (opt === 'a') {
            console.log('\nPilih Provider:');
            console.log(' 1. gemini (Google AI Studio)');
            console.log(' 2. openai (OpenAI GPT-4o)');
            console.log(' 3. anthropic (Claude)');
            console.log(' 4. groq (Llama / Fast)');
            console.log(' 5. custom / ollama (OpenAI-compatible URL)');
            const provNum = await this.ask('Provider [1-5]: ');
            const providerMap = {
                '1': 'gemini',
                '2': 'openai',
                '3': 'anthropic',
                '4': 'groq',
                '5': 'custom',
            };
            const provider = providerMap[provNum.trim()] || 'gemini';
            const label = await this.ask('Nama Label (contoh: Gemini Razan): ');
            const key = await this.ask('Masukkan API Key: ');
            let baseUrl = undefined;
            if (provider === 'custom') {
                baseUrl = await this.ask('Base URL (misal: http://localhost:11434/v1): ');
            }
            if (key.trim()) {
                const added = ConfigManager.addApiKey(label.trim(), provider, key.trim(), baseUrl?.trim());
                console.log(chalk.green(`✓ Berhasil menambahkan API key: ${added.label}\n`));
            }
            else {
                console.log(chalk.red('API Key tidak boleh kosong.\n'));
            }
        }
        else if (opt === 'd' && config.apiKeys.length > 0) {
            const idxStr = await this.ask('Masukkan nomor API key yang ingin dijadikan default: ');
            const idx = parseInt(idxStr.trim(), 10) - 1;
            if (config.apiKeys[idx]) {
                ConfigManager.setDefaultApiKey(config.apiKeys[idx].id);
                console.log(chalk.green(`✓ '${config.apiKeys[idx].label}' sekarang menjadi API key default.\n`));
            }
        }
        else if (opt === 'r' && config.apiKeys.length > 0) {
            const idxStr = await this.ask('Masukkan nomor API key yang ingin dihapus: ');
            const idx = parseInt(idxStr.trim(), 10) - 1;
            if (config.apiKeys[idx]) {
                ConfigManager.removeApiKey(config.apiKeys[idx].id);
                console.log(chalk.yellow(`✓ API key '${config.apiKeys[idx].label}' telah dihapus.\n`));
            }
        }
    }
    /**
     * Menu: Theme
     */
    static async handleThemeMenu() {
        const config = ConfigManager.load();
        console.log('\n' + chalk.bold.hex('#F59E0B')('🎨 PENGATURAN TEMA & TAMPILAN:'));
        console.log(' [1] Auto (Ungu saat Plan Mode, Hijau Tosca saat Agent Mode)');
        console.log(' [2] Purple Glow (Selalu aksen Ungu)');
        console.log(' [3] Tosca Electric (Selalu aksen Hijau Tosca)');
        console.log(' [4] Monochrome (Hitam & Putih klasik kontras tinggi)');
        const choice = await this.ask('Pilih tema [1-4]: ');
        const map = {
            '1': 'auto',
            '2': 'purple',
            '3': 'tosca',
            '4': 'monochrome',
        };
        const selected = map[choice.trim()] || 'auto';
        config.themePreference = selected;
        ConfigManager.save(config);
        console.log(chalk.green(`✓ Tema diatur ke: ${selected}\n`));
    }
    static ask(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise(resolve => {
            rl.question(chalk.yellow(question), answer => {
                rl.close();
                resolve(answer);
            });
        });
    }
}
