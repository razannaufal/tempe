import chalk from 'chalk';
export class ThemeManager {
    /**
     * Warna sesuai coretan sketsa & spesifikasi:
     * - Plan Mode: Ungu (now: Plan)
     * - Agent Mode: Hijau Tosca
     * - Normal: Putih / Hitam
     */
    static getTheme(mode) {
        switch (mode) {
            case 'plan':
                return {
                    primary: (t) => chalk.hex('#A855F7').bold(t),
                    primaryBg: (t) => chalk.bgHex('#7E22CE').white.bold(` ${t} `),
                    border: (t) => chalk.hex('#9333EA')(t),
                    tag: chalk.bgHex('#6B21A8').white.bold(' now: Plan '),
                    name: 'Ungu (Plan)',
                };
            case 'agent':
                return {
                    primary: (t) => chalk.hex('#14B8A6').bold(t),
                    primaryBg: (t) => chalk.bgHex('#0F766E').white.bold(` ${t} `),
                    border: (t) => chalk.hex('#0D9488')(t),
                    tag: chalk.bgHex('#115E59').white.bold(' now: Agent '),
                    name: 'Hijau Tosca (Agent)',
                };
            case 'normal':
            default:
                return {
                    primary: (t) => chalk.white.bold(t),
                    primaryBg: (t) => chalk.bgWhite.black.bold(` ${t} `),
                    border: (t) => chalk.gray(t),
                    tag: chalk.bgHex('#334155').white.bold(' now: Normal '),
                    name: 'Hitam / Putih (Normal)',
                };
        }
    }
    /**
     * Header kotak interaktif seperti pada sketsa buku catatan:
     * [                                     ] now: plan
     * agent <- -> plan   alt+c: menu
     */
    static renderHeader(mode, stateLabel = '') {
        const theme = this.getTheme(mode);
        const width = 64;
        const line = '─'.repeat(width - 2);
        const leftNav = mode === 'agent'
            ? chalk.bold.hex('#14B8A6')('● AGENT')
            : chalk.gray('<- agent');
        const rightNav = mode === 'plan'
            ? chalk.bold.hex('#A855F7')('PLAN ●')
            : chalk.gray('plan ->');
        return [
            theme.border(`┌${line}┐`),
            theme.border('│ ') +
                chalk.bold('tempe $') +
                ' '.repeat(Math.max(1, width - 24 - (stateLabel ? stateLabel.length : 0))) +
                (stateLabel ? chalk.yellow(stateLabel) + ' ' : '') +
                theme.tag +
                theme.border(' │'),
            theme.border(`├${line}┤`),
            theme.border('│ ') +
                `${leftNav}   ${chalk.gray('⇄')}   ${rightNav}` +
                ' '.repeat(Math.max(1, width - 36)) +
                chalk.hex('#F59E0B')('alt+c') + chalk.gray(': menu') +
                theme.border(' │'),
            theme.border(`└${line}┘`),
        ].join('\n');
    }
    /**
     * Box container untuk menampilkan output atau pesan
     */
    static box(content, title, mode = 'normal') {
        const theme = this.getTheme(mode);
        const lines = content.split('\n');
        const maxLine = Math.max(...lines.map(l => l.replace(/\u001b\[[0-9;]*m/g, '').length), title ? title.length + 4 : 20, 50);
        const topBar = title
            ? `┌─ ${theme.primary(title)} ${'─'.repeat(Math.max(0, maxLine - title.length - 2))}┐`
            : `┌${'─'.repeat(maxLine + 2)}┐`;
        const bottomBar = `└${'─'.repeat(maxLine + 2)}┘`;
        const body = lines.map(line => {
            const cleanLen = line.replace(/\u001b\[[0-9;]*m/g, '').length;
            const pad = ' '.repeat(Math.max(0, maxLine - cleanLen));
            return theme.border('│ ') + line + pad + theme.border(' │');
        }).join('\n');
        return `${theme.border(topBar)}\n${body}\n${theme.border(bottomBar)}`;
    }
}
