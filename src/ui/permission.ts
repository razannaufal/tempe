import readline from 'readline';
import chalk from 'chalk';

export type PermissionDecision = 'always' | 'allow_once' | 'not_allow';

export class PermissionManager {
  private static sessionAlwaysAllowed = false;

  public static isAlwaysAllowed(): boolean {
    return this.sessionAlwaysAllowed;
  }

  public static resetSession(): void {
    this.sessionAlwaysAllowed = false;
  }

  /**
   * Menampilkan dialog konfirmasi perizinan aksi sesuai gambar sketsa:
   * [1] always allow
   * [2] allow once
   * [3] not allow
   */
  public static async requestPermission(actionName: string, detail: string): Promise<boolean> {
    if (this.sessionAlwaysAllowed) {
      return true;
    }

    console.log('\n' + chalk.hex('#F59E0B')('╭─────────────────────────────────────────────────────────────╮'));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.bold.yellow('🛡️  KONFIRMASI IZIN AKSI AGENT') + '                               ' + chalk.hex('#F59E0B')('│'));
    console.log(chalk.hex('#F59E0B')('├─────────────────────────────────────────────────────────────┤'));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.bold.white(`Aksi:   `) + chalk.cyan(actionName));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.bold.white(`Detail: `) + chalk.gray(detail.slice(0, 52) + (detail.length > 52 ? '...' : '')));
    console.log(chalk.hex('#F59E0B')('├─────────────────────────────────────────────────────────────┤'));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.bold('Pilih izin eksekusi:'));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.green(' [1] always allow') + chalk.gray('   (izinkan semua aksi di sesi ini)'));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.cyan(' [2] allow once') + chalk.gray('     (izinkan hanya kali ini)'));
    console.log(chalk.hex('#F59E0B')('│ ') + chalk.red(' [3] not allow') + chalk.gray('      (tolak aksi ini)'));
    console.log(chalk.hex('#F59E0B')('╰─────────────────────────────────────────────────────────────╯'));

    const decision = await this.askChoice();

    if (decision === 'always') {
      this.sessionAlwaysAllowed = true;
      console.log(chalk.green('✓ Mode "always allow" aktif untuk sesi ini.\n'));
      return true;
    } else if (decision === 'allow_once') {
      console.log(chalk.cyan('✓ Diizinkan sekali ini.\n'));
      return true;
    } else {
      console.log(chalk.red('✗ Aksi dibatalkan oleh pengguna.\n'));
      return false;
    }
  }

  private static askChoice(): Promise<PermissionDecision> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      rl.question(chalk.bold.yellow('Pilih [1/2/3] (default: 2): '), answer => {
        rl.close();
        const trimmed = answer.trim();
        if (trimmed === '1') resolve('always');
        else if (trimmed === '3') resolve('not_allow');
        else resolve('allow_once');
      });
    });
  }
}
