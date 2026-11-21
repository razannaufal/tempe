import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
const execAsync = util.promisify(exec);
export class AgentTools {
    static getTools() {
        return {
            readFile: {
                name: 'readFile',
                description: 'Membaca isi berkas teks lokal',
                isMutating: false,
                execute: async ({ path: filePath }) => {
                    const abs = path.resolve(process.cwd(), filePath);
                    if (!fs.existsSync(abs)) {
                        return `Error: Berkas '${filePath}' tidak ditemukan.`;
                    }
                    const content = fs.readFileSync(abs, 'utf-8');
                    return content;
                },
            },
            writeFile: {
                name: 'writeFile',
                description: 'Membuat atau menimpa berkas dengan isi baru',
                isMutating: true,
                execute: async ({ path: filePath, content }) => {
                    const abs = path.resolve(process.cwd(), filePath);
                    const dir = path.dirname(abs);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    fs.writeFileSync(abs, content, 'utf-8');
                    return `Sukses: Berkas '${filePath}' berhasil ditulis (${content.length} karakter).`;
                },
            },
            editFile: {
                name: 'editFile',
                description: 'Mengubah bagian tertentu dalam berkas',
                isMutating: true,
                execute: async ({ path: filePath, target, replacement }) => {
                    const abs = path.resolve(process.cwd(), filePath);
                    if (!fs.existsSync(abs)) {
                        return `Error: Berkas '${filePath}' tidak ditemukan.`;
                    }
                    const content = fs.readFileSync(abs, 'utf-8');
                    if (!content.includes(target)) {
                        return `Error: Teks target tidak ditemukan di dalam '${filePath}'.`;
                    }
                    const updated = content.replace(target, replacement);
                    fs.writeFileSync(abs, updated, 'utf-8');
                    return `Sukses: Berkas '${filePath}' berhasil diperbarui.`;
                },
            },
            listDirectory: {
                name: 'listDirectory',
                description: 'Melihat daftar berkas dan folder dalam direktori',
                isMutating: false,
                execute: async ({ path: dirPath = '.' }) => {
                    const abs = path.resolve(process.cwd(), dirPath);
                    if (!fs.existsSync(abs)) {
                        return `Error: Direktori '${dirPath}' tidak ditemukan.`;
                    }
                    const entries = fs.readdirSync(abs, { withFileTypes: true });
                    const list = entries.map(e => `${e.isDirectory() ? '[DIR] ' : '      '}${e.name}`);
                    return list.join('\n');
                },
            },
            runCommand: {
                name: 'runCommand',
                description: 'Menjalankan perintah shell/terminal di sistem lokal',
                isMutating: true,
                execute: async ({ command }) => {
                    try {
                        const { stdout, stderr } = await execAsync(command, {
                            cwd: process.cwd(),
                            timeout: 60000,
                        });
                        return (stdout || '') + (stderr ? `\n[STDERR]:\n${stderr}` : '');
                    }
                    catch (err) {
                        return `Error eksekusi: ${err.message}\n${err.stdout || ''}\n${err.stderr || ''}`;
                    }
                },
            },
            gitStatus: {
                name: 'gitStatus',
                description: 'Memeriksa status git repository saat ini',
                isMutating: false,
                execute: async () => {
                    try {
                        const { stdout } = await execAsync('git status --short', { cwd: process.cwd() });
                        return stdout || '(Working tree clean)';
                    }
                    catch {
                        return 'Bukan git repository atau git tidak tersedia.';
                    }
                },
            },
        };
    }
}
