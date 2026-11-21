export interface DetectedLanguage {
    code: string;
    name: string;
    confidence: number;
}
export declare class LanguageDetector {
    private static indonesianKeywords;
    private static englishKeywords;
    /**
     * Mendeteksi bahasa dari teks masukan pengguna secara otomatis
     */
    static detect(text: string): DetectedLanguage;
    /**
     * Menghasilkan instruksi bahasa untuk sistem prompt AI
     */
    static getSystemInstruction(detected: DetectedLanguage): string;
}
