import readline from 'readline';
import chalk from 'chalk';
export class PlanExecutorUI {
    /**
     * Menampilkan tombol kecil hitam-putih monokrom untuk eksekusi plan
     * Sesuai catatan sketsa tangan:
     * "buat plan kalau user dan setuju bisa langsung (nanti ada tombol kecil hitam putih) dipencek"
     */
    static async promptPlanApproval(planSummary) {
        console.log('\n' + chalk.hex('#9333EA')('┌─────────────────────────────────────────────────────────────┐'));
        console.log(chalk.hex('#9333EA')('│ ') + chalk.bold.hex('#A855F7')('📋 RENCANA AKSI (PLAN MODE)') + '                                ' + chalk.hex('#9333EA')('│'));
        console.log(chalk.hex('#9333EA')('└─────────────────────────────────────────────────────────────┘'));
        console.log(planSummary);
        // Tombol monokrom kecil (hitam-putih)
        console.log('\n' + chalk.bgWhite.black.bold(' [ ● RUN PLAN ] ') + chalk.gray('  atau tekan ') + chalk.bold.white('[Enter]') + chalk.gray(' untuk langsung eksekusi'));
        console.log(chalk.gray('Tekan ') + chalk.bold.white('[n]') + chalk.gray(' untuk edit/tolak, atau ') + chalk.bold.white('[Esc]') + chalk.gray(' untuk batal.\n'));
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise(resolve => {
            rl.question(chalk.bold('Eksekusi rencana sekarang? [Y/n]: '), answer => {
                rl.close();
                const trimmed = answer.trim().toLowerCase();
                if (trimmed === 'n' || trimmed === 'tidak' || trimmed === 'no') {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
