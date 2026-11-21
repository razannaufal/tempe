# Rencana Implementasi: Otomatisasi Git Pre-Commit Hook

> Dihasilkan secara otomatis oleh Tempe CLI dalam **Plan Mode** (now: Plan)

## Analisis Kebutuhan
Proyek membutuhkan validasi format kode dan type-checking otomatis sebelum commit git diperbolehkan.

## Langkah Rencana Aksi
1. [ ] Memeriksa apakah `husky` atau git hooks bawaan sudah ada di proyek.
2. [ ] Menulis berkas script `.husky/pre-commit` dengan isi perintah:
   ```bash
   npm run lint && npm run typecheck
   ```
3. [ ] Memberikan izin eksekusi (`chmod +x .husky/pre-commit`).
4. [ ] Melakukan uji coba pembuatan commit dummy untuk memastikan hook berjalan.

---
**Persetujuan Rencana:**
Tekan tombol hitam-putih monokrom `[ ● RUN PLAN ]` untuk mengeksekusi rencana ini secara berurutan dalam **Agent Mode**.
