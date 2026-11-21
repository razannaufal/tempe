import { DetectedLanguage } from '../agent/prompt-lang.js';
export interface AIResponse {
    text: string;
    suggestedTools?: {
        name: string;
        params: any;
    }[];
    isPlan?: boolean;
    tokensUsed: {
        prompt: number;
        completion: number;
        total: number;
    };
    detectedLang: DetectedLanguage;
}
export declare class AIClient {
    /**
     * Menghasilkan respon AI dengan auto-language detection, multi-API provider,
     * dan auto-retry saat server sibuk/error.
     */
    static generate(prompt: string, mode: 'plan' | 'agent', modelOverride?: string): Promise<AIResponse>;
    private static callProvider;
}
