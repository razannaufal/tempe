export class LanguageDetector {
    static indonesianKeywords = new Set([
        'buatkan', 'tolong', 'bagaimana', 'gimana', 'bikin', 'tampilkan', 'apakah', 'coba',
        'bisa', 'gak', 'nggak', 'tidak', 'udah', 'sudah', 'tambahin', 'tambahkan', 'ganti',
        'perbaiki', 'ubah', 'hapus', 'jalankan', 'eksekusi', 'kode', 'proyek', 'saya', 'kamu',
        'dong', 'ya', 'kan', 'nya', 'ini', 'itu', 'di', 'ke', 'dari', 'yang', 'dan', 'atau',
        'apa', 'kenapa', 'karena', 'kalau', 'jika', 'nanti', 'besok', 'sekarang', 'tempe'
    ]);
    static englishKeywords = new Set([
        'create', 'build', 'please', 'how', 'show', 'is', 'try', 'can', 'not', 'already',
        'add', 'change', 'fix', 'update', 'delete', 'run', 'execute', 'code', 'project',
        'my', 'you', 'the', 'this', 'that', 'in', 'to', 'from', 'which', 'and', 'or',
        'what', 'why', 'because', 'if', 'later', 'tomorrow', 'now', 'make', 'implement'
    ]);
    /**
     * Mendeteksi bahasa dari teks masukan pengguna secara otomatis
     */
    static detect(text) {
        const cleaned = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ' ');
        const tokens = cleaned.split(/\s+/).filter(Boolean);
        if (tokens.length === 0) {
            return { code: 'id', name: 'Bahasa Indonesia', confidence: 0.5 };
        }
        let idScore = 0;
        let enScore = 0;
        for (const t of tokens) {
            if (this.indonesianKeywords.has(t))
                idScore += 2;
            if (this.englishKeywords.has(t))
                enScore += 2;
        }
        // Default heuristics: If contains clear Indonesian tokens, treat as Indonesian
        if (idScore >= enScore && idScore > 0) {
            return { code: 'id', name: 'Bahasa Indonesia', confidence: Math.min(1.0, 0.6 + idScore * 0.1) };
        }
        if (enScore > idScore) {
            return { code: 'en', name: 'English', confidence: Math.min(1.0, 0.6 + enScore * 0.1) };
        }
        // Default to Indonesian if in doubt, or English
        return { code: 'id', name: 'Bahasa Indonesia', confidence: 0.5 };
    }
    /**
     * Menghasilkan instruksi bahasa untuk sistem prompt AI
     */
    static getSystemInstruction(detected) {
        return [
            `[LANGUAGE DIRECTIVE]`,
            `User language detected: ${detected.name} (${detected.code}).`,
            `You MUST strictly formulate your response in ${detected.name}.`,
            `Keep technical code, paths, and commands accurate while explanations and guidance must match the user's language.`,
        ].join('\n');
    }
}
