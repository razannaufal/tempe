import chalk from 'chalk';
import { ConfigManager } from '../core/config.js';
import { AIClient, AIResponse } from '../providers/ai-client.js';
import { AgentTools } from './tools.js';
import { PermissionManager } from '../ui/permission.js';
import { PlanExecutorUI } from '../ui/plan-exec.js';
import { HistoryManager } from '../core/history.js';
import { TempeMascot, TempeState } from '../mascot/tempe-art.js';
import { ThemeManager, AppMode } from '../ui/theme.js';

export class AgentLoop {
  private static isInterrupted = false;

  public static interrupt(): void {
    this.isInterrupted = true;
  }

  public static resetInterrupt(): void {
    this.isInterrupted = false;
  }

  /**
   * Menjalankan siklus eksekusi AI coding agent
   */
  public static async execute(
    userPrompt: string,
    mode: 'plan' | 'agent',
    onStateChange?: (state: TempeState) => void
  ): Promise<void> {
    this.resetInterrupt();
    const config = ConfigManager.load();
    const activeKey = ConfigManager.getActiveApiKey(config);

    // 1. Validasi API Key
    if (!activeKey) {
      if (onStateChange) onStateChange('needs_repo');
      console.log('\n' + TempeMascot.getMascotArt('needs_repo'));
      console.log('\n' + chalk.bold.red('⚠️  [API Key Belum Ditemukan]'));
      console.log(chalk.yellow('Tempe memerlukan API key untuk beroperasi.'));
      console.log(chalk.white('Tekan ') + chalk.bold.cyan('[Alt+C]') + chalk.white(' -> pilih nomor ') + chalk.bold.cyan('[4]') + chalk.white(' untuk menambah API key (Gemini, OpenAI, Groq, Claude, atau Ollama).\n'));
      return;
    }

    // 2. Tampilkan status awal
    if (mode === 'agent') {
      if (onStateChange) onStateChange('agent_working');
      console.log('\n' + chalk.hex('#14B8A6')('⚡ Mengaktifkan Agent Mode...'));
    } else {
      console.log('\n' + chalk.hex('#A855F7')('📋 Mengaktifkan Plan Mode...'));
    }

    try {
      // 3. Panggil AI dengan auto-language detection dan auto-retry
      const response: AIResponse = await AIClient.generate(userPrompt, mode, config.defaultModel);

      if (this.isInterrupted) {
        console.log(chalk.red('\n[!] Proses dibatalkan oleh pengguna (ESC Interrupt).\n'));
        return;
      }

      // 4. Tangani hasil berdasarkan mode
      if (mode === 'plan') {
        // Tampilkan Plan dengan aksen Ungu
        console.log('\n' + ThemeManager.box(response.text, 'RENCANA IMPLEMENTASI TEMPE', 'plan'));

        // Simpan ke riwayat
        HistoryManager.add({
          mode: 'plan',
          model: config.defaultModel,
          prompt: userPrompt,
          response: response.text,
          tokens: response.tokensUsed.total,
        });

        // Tawarkan eksekusi plan dengan tombol kecil monokrom hitam putih
        const shouldExecute = await PlanExecutorUI.promptPlanApproval(
          chalk.gray('Ringkasan: AI telah menyusun langkah-langkah di atas.')
        );

        if (shouldExecute) {
          console.log(chalk.green('\n✓ Menjalankan rencana dalam Agent Mode...'));
          await this.execute(
            `Jalankan rencana implementasi berikut secara otomatis:\n${response.text}`,
            'agent',
            onStateChange
          );
        } else {
          console.log(chalk.gray('Rencana disimpan. Anda dapat mengeksekusinya nanti.\n'));
        }
      } else {
        // Agent Mode
        console.log('\n' + ThemeManager.box(response.text, 'HASIL EKSEKUSI AGENT', 'agent'));

        // Cek apakah ada eksekusi tools yang disarankan
        const tools = AgentTools.getTools();
        const executedTools: string[] = [];

        // Deteksi perintah shell dari respon (e.g. ```bash ... ```)
        const bashMatches = response.text.match(/```(?:bash|sh|shell|powershell|cmd)\n([\s\S]*?)```/g);
        if (bashMatches && bashMatches.length > 0) {
          for (const block of bashMatches) {
            if (this.isInterrupted) break;
            const command = block.replace(/```(?:bash|sh|shell|powershell|cmd)\n/, '').replace(/```$/, '').trim();
            if (command) {
              const allowed = await PermissionManager.requestPermission('runCommand', command);
              if (allowed) {
                console.log(chalk.cyan(`\n$ ${command}`));
                const output = await tools.runCommand.execute({ command });
                console.log(chalk.gray(output));
                executedTools.push(`runCommand: ${command.slice(0, 30)}`);
              }
            }
          }
        }

        // Simpan ke riwayat
        HistoryManager.add({
          mode: 'agent',
          model: config.defaultModel,
          prompt: userPrompt,
          response: response.text,
          toolsUsed: executedTools,
          tokens: response.tokensUsed.total,
        });

        // 5. Ubah maskot menjadi Mateng Sempurna (ada sinar di ujung)
        if (onStateChange) onStateChange('mateng_shining');
        console.log('\n' + TempeMascot.getMascotArt('mateng_shining'));
        console.log(chalk.green('\n✓ Tugas selesai dengan sukses!\n'));
      }
    } catch (err: any) {
      if (err.isApiKeyMissing) {
        if (onStateChange) onStateChange('needs_repo');
        console.log('\n' + TempeMascot.getMascotArt('needs_repo'));
        console.log(chalk.yellow(`\n${err.message}\n`));
      } else {
        // Tampilkan ekspresi Tempe Marah / Overlimit
        if (onStateChange) onStateChange('angry');
        console.log('\n' + TempeMascot.getMascotArt('angry'));
        console.log(chalk.red(`\n[Error Agent]: ${err?.message || err}\n`));
      }
    }
  }
}
