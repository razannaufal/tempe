import chalk from 'chalk';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelaySeconds?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, delaySeconds: number, error: any) => void;
}

export class RetryHandler {
  /**
   * Menjalankan fungsi async dengan auto-retry dan countdown timer interaktif di terminal.
   * Langsung merefleksikan catatan sketsa:
   * "kalau server error / sibuk bisa retrying to connect, sambil ada waktunya"
   */
  public static async executeWithCountdown<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const maxAttempts = options.maxAttempts ?? 3;
    let delay = options.initialDelaySeconds ?? 3;
    const factor = options.backoffFactor ?? 1.5;

    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        return await operation();
      } catch (err: any) {
        attempt++;
        const errMsg = err?.message || 'Server sibuk atau timeout';

        // Jangan retry untuk error client (400, 401, 403, 404) karena tidak akan berubah
        const isClientError = /http (400|401|403|404)/i.test(errMsg) || /not found|unauthorized|invalid api key/i.test(errMsg);
        if (isClientError || attempt >= maxAttempts) {
          throw err;
        }

        const waitSeconds = Math.round(delay);

        // Tampilkan notifikasi awal
        process.stdout.write('\n');
        console.log(
          chalk.yellow('⚠️  [Koneksi Terganggu] ') +
          chalk.white(errMsg)
        );

        // Countdown timer interaktif
        for (let rem = waitSeconds; rem > 0; rem--) {
          const formattedTime = `00:${rem.toString().padStart(2, '0')}`;
          process.stdout.write(
            `\r${chalk.hex('#F59E0B')('🔄 Retrying to connect...')} ` +
            chalk.bold.hex('#38BDF8')(`[${formattedTime}]`) +
            `  ${chalk.gray(`(Percobaan ${attempt}/${maxAttempts})`)}`
          );
          await this.sleep(1000);
        }

        process.stdout.write(
          `\r${chalk.green('🚀 Mencoba menyambung kembali sekarang...')}              \n`
        );

        delay *= factor;
      }
    }

    throw new Error('Maksimum percobaan retry terlampaui.');
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
