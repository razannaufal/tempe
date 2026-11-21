# 🍱 Tempe CLI — Terminal AI Coding Agent

> Sebuah AI Coding Agent berbasis terminal yang cepat, ekspresif, dan berdaya guna tinggi menyerupai OpenCode, dilengkapi karakter maskot dinamis **"@ tempe"**, manajemen multi-API key, deteksi bahasa otomatis, dan pemantauan token/kuota secara realtime.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tempe-ai/tempe)
[![Documentation](https://img.shields.io/badge/docs-tempe--ai.github.io-teal.svg)](https://tempe-ai.github.io)

---

## 🌟 Fitur Utama

1. **Prompt Interaktif Khas (`tempe $`)**:
   - Format antarmuka terminal yang ringkas dan responsif dengan status header interaktif.
2. **Karakter Maskot Dinamis ("@ tempe")**:
   - **Belum Siap / Fermentasi**: Tampilan proto-tempe saat inisialisasi belum tuntas.
   - **Butuh Akses / API (`?`)**: Ikon tanda tanya muncul saat API key atau akses direktori repository belum terhubung.
   - **Agent Working / Menggoreng**: Animasi sizzling saat AI sedang menyusun dan mengeksekusi instruksi kode.
   - **Mateng Keemasan (Shining `✨`)**: Efek berkilau di ujung atas saat tugas berhasil diselesaikan secara sempurna.
   - **Marah / Overlimit (`(>_<)`)**: Ekspresi membara jika quota penggunaan terlampaui atau terjadi kegagalan sistem.
3. **Dual Mode & Tema Warna Terintegrasi**:
   - **Plan Mode**: Tema warna **Ungu** (`now: Plan`) untuk merancang arsitektur & daftar rencana sebelum eksekusi.
   - **Agent Mode**: Tema warna **Hijau Tosca** (`now: Agent`) untuk eksekusi langsung, tool calling, dan penulisan berkas.
   - **Normal Mode**: Tema **Hitam / Putih** kontras tinggi yang ramah pembaca layar.
4. **Kontrol Cepat & Shortcut**:
   - `<-` : Beralih ke **Agent Mode**
   - `->` : Beralih ke **Plan Mode**
   - `alt + c` : Membuka **Menu Utama**
   - `esc` : **Interrupt** / membatalkan generasi respon atau aksi agent seketika
5. **Konfirmasi Perizinan Berjenjang (Permissions)**:
   - `[1] always allow` : Izinkan semua perintah untuk sesi kerja saat ini.
   - `[2] allow once` : Izinkan hanya untuk satu aksi ini.
   - `[3] not allow` : Tolak eksekusi perintah shell / penulisan berkas.
6. **Eksekusi Plan Cepat**:
   - Setelah rencana disetujui, tombol monokrom kecil `[ ● RUN PLAN ]` memudahkan eksekusi rencana tanpa mengetik ulang.
7. **Deteksi Bahasa Otomatis (Auto-Language Detection)**:
   - AI otomatis mengenali apakah Anda menggunakan Bahasa Indonesia atau English, dan akan membalas dengan bahasa yang sama secara natural.
8. **Manajemen Multi-API Key**:
   - Dukungan lebih dari satu API key dalam satu CLI (Google Gemini, OpenAI, Anthropic Claude, Groq, Ollama / Custom Endpoint).
9. **Monitoring Usage, Token & Tagihan ($)**:
   - Pantau persentase pemakaian kuota, rincian input/output token, dan estimasi biaya per model yang sudah digunakan.
10. **Ketahanan Jaringan (Auto-Retry)**:
    - Jika server AI sibuk atau mengalami timeout, Tempe secara otomatis melakukan retry dengan hitung mundur timer interaktif (`[00:03]`).

---

## 🚀 Instalasi & Memulai Cepat

Tempe CLI membutuhkan **Node.js 20 atau lebih baru** untuk instalasi melalui npm.

### Menggunakan npm (Global)
```bash
npm install -g tempe-cli
```
Setelah terpasang, jalankan perintah setup untuk menginisialisasi prompt:
```bash
tempe setup
# Notifikasi akan muncul: "Format prompt aktif: tempe $"
```

### Menjalankan CLI
Cukup ketik:
```bash
tempe
```

### Windows tanpa Node.js

Unduh ZIP `tempe-vX.Y.Z-windows-x64.zip` dari [GitHub Releases](https://github.com/tempe-ai/tempe/releases/latest), ekstrak, lalu jalankan `tempe.exe`. Agar perintah `tempe` bisa dipanggil dari folder mana pun, tambahkan folder hasil ekstrak ke `PATH` Windows.

### Opsi Perintah Langsung
```bash
# Menjalankan dalam Plan Mode langsung
tempe plan "Buatkan struktur backend Express dengan TypeScript dan Prisma"

# Menjalankan dalam Agent Mode langsung
tempe agent "Periksa git status dan buat berkas konfigurasi .env.example"

# Cek monitoring pemakaian token dan estimasi biaya
tempe usage

# Kelola API key
tempe api

# Ganti model AI aktif
tempe models
```

---

## 🔑 Konfigurasi Multi-API Key

Buka menu API dengan menekan `alt + c` lalu pilih `[4] API`, atau jalankan:
```bash
tempe api
```

Pilih provider yang diinginkan:
1. `gemini` (Google AI Studio)
2. `openai` (OpenAI GPT-4o)
3. `anthropic` (Claude 3.7 Sonnet)
4. `groq` (Llama 3.3 70B Fast)
5. `custom / ollama` (Lokal atau self-hosted)

Semua konfigurasi disimpan secara aman di `~/.tempe/config.json`.

---

## 🧩 Kompatibilitas IDE & Workflow

Tempe dirancang fleksibel untuk bekerja berdampingan dengan alur kerja modern:

### 1. Antigravity & Terminal Terintegrasi
- Buka terminal terintegrasi (`Ctrl + ~`) di Antigravity, lalu ketik `tempe`.
- Maskot Tempe akan mendeteksi workspace repository aktif secara otomatis.

### 2. Cursor IDE
- Jalankan Tempe di background terminal Cursor.
- Anda dapat meminta Tempe membuat plan di terminal (`tempe plan`), menyetujuinya dengan `[ ● RUN PLAN ]`, sementara Cursor mendeteksi perubahan file secara realtime.

### 3. Kiro & Neovim
- Menggunakan mode warna monokrom (`theme -> monochrome`) untuk integrasi sempurna dengan color scheme Neovim/Kiro.

### 4. GitHub Workflow & Actions
- Gunakan Tempe dalam skrip CI/CD atau pre-commit hook untuk verifikasi rencana kode:
```bash
npx tempe-cli plan "Review recent changes and generate pull request summary"
```

---

## 🛠️ Build dari Source Code

Jika ingin melakukan compile mandiri:
```bash
# Clone repositori
git clone https://github.com/tempe-ai/tempe.git
cd tempe/tempe-cli

# Pasang dependensi
npm install

# Compile TypeScript
npm run build

# Uji coba secara lokal
npm start
```

### Membuat rilis

Naikkan `version` di `package.json` dan `UpdateChecker.CURRENT_VERSION` di [`src/core/updater.ts`](./src/core/updater.ts), commit perubahan, lalu buat dan push tag versi yang sama:

```bash
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions akan membuat Windows x64 executable dan melampirkannya ke GitHub Release. Untuk mengaktifkan publish npm otomatis, tambahkan repository secret `NPM_TOKEN` (token npm dengan izin publish) dan repository variable `PUBLISH_NPM=true`. Tag rilis harus sama dengan versi di `package.json`.

Untuk publish manual, login ke npm lalu jalankan dari folder `tempe-cli`:

```bash
npm login
npm publish --access public
```

---

## 📄 Contoh File Template (`.md`)

Lihat template spesifikasi dan rencana implementasi di:
- [`templates/SPEC_TEMPLATE.md`](templates/SPEC_TEMPLATE.md)
- [`templates/PLAN_EXAMPLE.md`](templates/PLAN_EXAMPLE.md)

---

## 💖 Kolom Donasi (Dukung Pengembang Tempe)

<details>
<summary><b>Klik di sini untuk membuka opsi Donasi & Dukungan 🍱✨</b></summary>
<br>

Pengembangan **Tempe CLI** didukung secara independen dan open-source untuk komunitas developer. Jika Anda merasa Tempe membantu produktivitas coding Anda, pertimbangkan untuk mentraktir tempe goreng keju atau secangkir kopi!

| Metode | Link / Rekening | Keterangan |
|---|---|---|
| **Saweria** | [saweria.co/tempeai](https://saweria.co) | Mendukung QRIS, GoPay, OVO, Dana, ShopeePay |
| **Ko-fi** | [ko-fi.com/tempeai](https://ko-fi.com) | Dukungan internasional kartu / PayPal |
| **GitHub Sponsors** | [github.com/sponsors/tempe-ai](https://github.com/sponsors) | Dukungan bulanan atau satu kali |
| **Crypto (USDT/SOL)** | `tempe.sol` / `0x7E...3A9` | Jaringan Solana / Polygon |

*Setiap donatur akan dicantumkan namanya dalam daftar Supporter Hall of Fame di website resmi Tempe!*

</details>

---

## 📄 Lisensi
Didistribusikan di bawah lisensi **MIT**. Hak cipta © 2026 Tempe AI Community.
