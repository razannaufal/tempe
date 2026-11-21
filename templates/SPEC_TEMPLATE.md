# [Nama Fitur/Modul] — Spesifikasi Teknis Tempe

## 1. Ringkasan & Tujuan
Jelaskan secara singkat apa yang ingin dicapai, masalah yang diselesaikan, dan dampak yang diharapkan terhadap pengguna atau sistem.

## 2. Arsitektur & Diagram Alur
```
[Pengguna / CLI] ──> [Tempe Agent] ──> [Tool Execution] ──> [File System / Git]
```

## 3. Komponen Utama
- **Modul A**: Tanggung jawab dan antarmuka fungsi.
- **Modul B**: State management dan penyimpanan konfigurasi.
- **Modul C**: Integrasi API eksternal dan resilience handler.

## 4. Rencana Langkah Implementasi (Plan Steps)
1. Inisialisasi struktur direktori dan tipe data TypeScript.
2. Implementasi logic unit dan penanganan error.
3. Integrasi ke terminal UI dan penambahan shortcut tombol.
4. Pengujian menyeluruh (unit test & e2e CLI test).
5. Pembaruan dokumentasi README dan website portal.

## 5. Batasan & Risiko
- Penanganan limit kuota API.
- Ketahanan terhadap timeout jaringan (auto-retry).
