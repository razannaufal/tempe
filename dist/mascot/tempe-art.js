import chalk from 'chalk';
export class TempeMascot {
    /**
     * Menghasilkan ASCII art karakter tempe sesuai dengan status dinamisnya.
     * Terinspirasi langsung dari coretan sketsa:
     * - "kalau belum siap tempenya belum sempurna bentuknya"
     * - "tempenya bakal jadi mateng kl udah jadi -> ada sinar di ujung"
     * - "kl butuh akses ke repo tempe logonya jadi ada tanda tanya ?"
     * - "kondisi marah bila melewati batas"
     */
    static getMascotArt(state) {
        switch (state) {
            case 'mateng_shining':
                return [
                    chalk.yellow('       . : *  ✧  * : .       ') + chalk.bold.hex('#F59E0B')('✨ SINAR TEMPE MATENG ✨'),
                    chalk.yellow('     *  .  ☀️   *   .  *      ') + chalk.hex('#FBBF24')('Crispy, Golden & Ready!'),
                    chalk.hex('#D97706')('    ┌─────────────────────┐  '),
                    chalk.hex('#D97706')('    │  ') + chalk.bold.hex('#FEF3C7')('●   ') + chalk.hex('#B45309')('░░░░') + chalk.bold.hex('#FEF3C7')('   ●') + chalk.hex('#D97706')('  │  ') + chalk.bold.hex('#10B981')('  @ tempe'),
                    chalk.hex('#D97706')('    │     ') + chalk.bold.hex('#FDE68A')('\\_____/') + chalk.hex('#D97706')('     │  ') + chalk.hex('#6EE7B7')('  [Status: Mateng Sempurna]'),
                    chalk.hex('#D97706')('    │  ') + chalk.hex('#B45309')('░░░░░░░░░░░░░░░░░') + chalk.hex('#D97706')('  │  ') + chalk.gray('  Kode siap & tugas selesai!'),
                    chalk.hex('#D97706')('    └─────────────────────┘  '),
                ].join('\n');
            case 'unready':
                return [
                    chalk.gray('         .  ~  .  *          '),
                    chalk.hex('#94A3B8')('    ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ') + chalk.hex('#94A3B8')('  @ tempe (proto-tempe)'),
                    chalk.hex('#94A3B8')('    │  ') + chalk.white('o   ') + chalk.gray('· · ·') + chalk.white('   o') + chalk.hex('#94A3B8')('  │  ') + chalk.yellow('  [Status: Fermentasi...]'),
                    chalk.hex('#94A3B8')('    │       ') + chalk.hex('#CBD5E1')('-----') + chalk.hex('#94A3B8')('       │  ') + chalk.gray('  Bentuk belum sempurna,'),
                    chalk.hex('#94A3B8')('    │  ') + chalk.gray('· · · · · · · · ·') + chalk.hex('#94A3B8')('  │  ') + chalk.gray('  sedang menyiapkan ragi.'),
                    chalk.hex('#94A3B8')('    └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  '),
                ].join('\n');
            case 'needs_repo':
                return [
                    chalk.yellow('          ╭───────╮          '),
                    chalk.yellow('          │   ') + chalk.bold.bgYellow.black(' ? ') + chalk.yellow('   │          ') + chalk.bold.hex('#F59E0B')('  @ tempe'),
                    chalk.yellow('          ╰───┬───╯          ') + chalk.hex('#FCD34D')('  [Status: Butuh Akses / API]'),
                    chalk.hex('#E2E8F0')('    ┌─────────┴───────────┐  '),
                    chalk.hex('#E2E8F0')('    │  ') + chalk.bold.white('•   ') + chalk.gray('░░░░') + chalk.bold.white('   •') + chalk.hex('#E2E8F0')('  │  ') + chalk.yellow('  ⚠️ Perlu API key atau akses repo!'),
                    chalk.hex('#E2E8F0')('    │       ') + chalk.hex('#94A3B8')('~ o ~') + chalk.hex('#E2E8F0')('       │  ') + chalk.gray('  Tekan Alt+C lalu pilih menu API.'),
                    chalk.hex('#E2E8F0')('    └─────────────────────┘  '),
                ].join('\n');
            case 'agent_working':
                return [
                    chalk.cyan('        ~ ~ Sizzling ~ ~     '),
                    chalk.hex('#2DD4BF')('    ┌─────────────────────┐  ') + chalk.bold.hex('#14B8A6')('  @ tempe [AGENT MODE]'),
                    chalk.hex('#2DD4BF')('    │  ') + chalk.bold.white('ò   ') + chalk.hex('#0D9488')('░░░░') + chalk.bold.white('   ó') + chalk.hex('#2DD4BF')('  │  ') + chalk.hex('#5EEAD4')('  [Status: Menggoreng Kode...]'),
                    chalk.hex('#2DD4BF')('    │     ') + chalk.bold.hex('#99F6E4')('(  ⚡  )') + chalk.hex('#2DD4BF')('     │  ') + chalk.gray('  Sedang mengeksekusi aksi & tools'),
                    chalk.hex('#2DD4BF')('    │  ') + chalk.hex('#0D9488')('░░░░░░░░░░░░░░░░░') + chalk.hex('#2DD4BF')('  │  ') + chalk.gray('  Tekan ESC untuk interrupt'),
                    chalk.hex('#2DD4BF')('    └─────────────────────┘  '),
                ].join('\n');
            case 'angry':
                return [
                    chalk.red('       ( ( (  ASAP!  ) ) )    '),
                    chalk.hex('#EF4444')('    ┌─────────────────────┐  ') + chalk.bold.red('  @ tempe [MARAH / OVERLIMIT]'),
                    chalk.hex('#EF4444')('    │  ') + chalk.bold.white('>   ') + chalk.hex('#991B1B')('░░░░') + chalk.bold.white('   <') + chalk.hex('#EF4444')('  │  ') + chalk.hex('#FCA5A5')('  [Status: Overlimit / Error!]'),
                    chalk.hex('#EF4444')('    │     ') + chalk.bold.white('( ╬ಠ益ಠ)') + chalk.hex('#EF4444')('     │  ') + chalk.red('  Batas pemakaian atau error server!'),
                    chalk.hex('#EF4444')('    │  ') + chalk.hex('#991B1B')('░░░░░░░░░░░░░░░░░') + chalk.hex('#EF4444')('  │  ') + chalk.gray('  Cek menu usage (Alt+C -> 1)'),
                    chalk.hex('#EF4444')('    └─────────────────────┘  '),
                ].join('\n');
            case 'idle':
            default:
                return [
                    chalk.hex('#E2E8F0')('    ┌─────────────────────┐  '),
                    chalk.hex('#E2E8F0')('    │  ') + chalk.bold.white('^   ') + chalk.hex('#94A3B8')('░░░░') + chalk.bold.white('   ^') + chalk.hex('#E2E8F0')('  │  ') + chalk.bold.white('  @ tempe'),
                    chalk.hex('#E2E8F0')('    │       ') + chalk.hex('#CBD5E1')('(___)') + chalk.hex('#E2E8F0')('       │  ') + chalk.hex('#94A3B8')('  Terminal AI Coding Agent'),
                    chalk.hex('#E2E8F0')('    │  ') + chalk.hex('#94A3B8')('░░░░░░░░░░░░░░░░░') + chalk.hex('#E2E8F0')('  │  ') + chalk.gray('  Siap membantu coding!'),
                    chalk.hex('#E2E8F0')('    └─────────────────────┘  '),
                ].join('\n');
        }
    }
    /**
     * Compact badge icon untuk status bar atau prompt
     */
    static getBadge(state) {
        switch (state) {
            case 'mateng_shining':
                return chalk.bold.hex('#F59E0B')('✨ @tempe [Mateng] ☀️');
            case 'unready':
                return chalk.hex('#94A3B8')('🌱 @tempe [Fermentasi]');
            case 'needs_repo':
                return chalk.bold.yellow('❓ @tempe [Perlu API/Repo]');
            case 'agent_working':
                return chalk.bold.hex('#14B8A6')('⚡ @tempe [Agent Aktif]');
            case 'angry':
                return chalk.bold.red('🔥 @tempe [Limit/Error!]');
            case 'idle':
            default:
                return chalk.bold.white('🍱 @tempe [Ready]');
        }
    }
}
