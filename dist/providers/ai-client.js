import chalk from 'chalk';
import { ConfigManager } from '../core/config.js';
import { UsageTracker } from '../core/usage.js';
import { RetryHandler } from '../core/retry.js';
import { LanguageDetector } from '../agent/prompt-lang.js';
export class AIClient {
    /**
     * Menghasilkan respon AI dengan auto-language detection, multi-API provider,
     * dan auto-retry saat server sibuk/error.
     */
    static async generate(prompt, mode, modelOverride) {
        const config = ConfigManager.load();
        const activeKey = ConfigManager.getActiveApiKey(config);
        const model = modelOverride || config.defaultModel;
        // Deteksi bahasa otomatis
        const detectedLang = LanguageDetector.detect(prompt);
        // Jika belum ada API Key yang dikonfigurasi:
        if (!activeKey || !activeKey.key) {
            const isIndonesian = detectedLang.code === 'id';
            const msg = isIndonesian
                ? `⚠️ [API Key Belum Ada] Anda belum menambahkan API Key.\n` +
                    `Silakan tambahkan API key dengan menekan [Alt+C] -> Menu API, atau jalankan perintah: tempe api add`
                : `⚠️ [No API Key Configured] You haven't added an API Key yet.\n` +
                    `Please add an API key by pressing [Alt+C] -> API Menu, or run command: tempe api add`;
            const error = new Error(msg);
            error.isApiKeyMissing = true;
            throw error;
        }
        // Eksekusi pemanggilan AI dengan mekanisme Retry
        return await RetryHandler.executeWithCountdown(async () => {
            return await this.callProvider(activeKey, model, prompt, mode, detectedLang);
        }, {
            maxAttempts: 3,
            initialDelaySeconds: 3,
        });
    }
    static async callProvider(keyEntry, model, prompt, mode, detectedLang) {
        const langInstruction = LanguageDetector.getSystemInstruction(detectedLang);
        const systemPrompt = [
            `You are Tempe, a friendly, ultra-competent Terminal AI Coding Agent.`,
            mode === 'plan'
                ? `You are currently in PLAN MODE. Break down user goals into concrete, structured, numbered steps. Do NOT execute tools yet.`
                : `You are currently in AGENT MODE. Provide direct solutions, code snippets, and execute actions decisively.`,
            langInstruction,
        ].join('\n\n');
        // Estimasi tokens
        const promptTokens = Math.max(20, Math.round(prompt.length / 3));
        // Handle provider OpenAI / Groq / Custom
        if (keyEntry.provider === 'openai' || keyEntry.provider === 'groq' || keyEntry.provider === 'custom') {
            const url = keyEntry.baseUrl || (keyEntry.provider === 'groq'
                ? 'https://api.groq.com/openai/v1/chat/completions'
                : 'https://api.openai.com/v1/chat/completions');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keyEntry.key}`,
                },
                body: JSON.stringify({
                    model: keyEntry.model || model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    temperature: mode === 'plan' ? 0.3 : 0.7,
                }),
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status} from ${keyEntry.provider}: ${errText}`);
            }
            const json = await response.json();
            const content = json.choices?.[0]?.message?.content || '';
            const usage = json.usage || { prompt_tokens: promptTokens, completion_tokens: 120, total_tokens: promptTokens + 120 };
            UsageTracker.recordUsage(model, usage.prompt_tokens, usage.completion_tokens);
            return {
                text: content,
                tokensUsed: { prompt: usage.prompt_tokens, completion: usage.completion_tokens, total: usage.total_tokens },
                detectedLang,
                isPlan: mode === 'plan',
            };
        }
        // Handle Gemini API
        if (keyEntry.provider === 'gemini') {
            // Pakai model apa adanya dari config — ID langsung dari daftar provider.
            // Strip prefix "models/" kalau secara tidak sengaja tersimpan dengan itu.
            const targetModel = (keyEntry.model || model || 'gemini-2.5-flash')
                .trim()
                .replace(/^models\//, '');
            let url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${keyEntry.key}`;
            let response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Request: ${prompt}` }] }],
                }),
            });
            // Auto-fallback ke gemini-2.5-flash jika model tidak ditemukan (404)
            if (!response.ok && response.status === 404 && targetModel !== 'gemini-2.5-flash') {
                console.log(chalk.yellow(`\n⚠️  Model "${targetModel}" tidak ditemukan, beralih ke gemini-2.5-flash...`));
                url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyEntry.key}`;
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Request: ${prompt}` }] }],
                    }),
                });
            }
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status} from Gemini: ${errText}`);
            }
            const json = await response.json();
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const completionTokens = Math.max(30, Math.round(text.length / 3));
            UsageTracker.recordUsage(targetModel, promptTokens, completionTokens);
            return {
                text,
                tokensUsed: { prompt: promptTokens, completion: completionTokens, total: promptTokens + completionTokens },
                detectedLang,
                isPlan: mode === 'plan',
            };
        }
        // Handle Anthropic API
        if (keyEntry.provider === 'anthropic') {
            const url = 'https://api.anthropic.com/v1/messages';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': keyEntry.key,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: keyEntry.model || model || 'claude-3-7-sonnet-20250219',
                    max_tokens: 4096,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: prompt }],
                }),
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status} from Anthropic: ${errText}`);
            }
            const json = await response.json();
            const text = json.content?.[0]?.text || '';
            const usage = json.usage || { input_tokens: promptTokens, output_tokens: 150 };
            UsageTracker.recordUsage(model, usage.input_tokens, usage.output_tokens);
            return {
                text,
                tokensUsed: { prompt: usage.input_tokens, completion: usage.output_tokens, total: usage.input_tokens + usage.output_tokens },
                detectedLang,
                isPlan: mode === 'plan',
            };
        }
        // Fallback: Local / Ollama or Mock Simulation for testing
        const fallbackText = mode === 'plan'
            ? `📋 [TEMPE PLAN - Model: ${model}]\n` +
                `1. Menganalisis kebutuhan: "${prompt}"\n` +
                `2. Memeriksa berkas yang relevan di direktori kerja\n` +
                `3. Menyiapkan implementasi dan modifikasi kode\n` +
                `4. Menjalankan pengujian (lint/test) dan verifikasi status git`
            : `🚀 [TEMPE AGENT - Model: ${model}]\n` +
                `Menjalankan tugas untuk: "${prompt}"\n` +
                `Analisis selesai. Siap mengeksekusi langkah kode.`;
        const completionTokens = Math.max(25, Math.round(fallbackText.length / 3));
        UsageTracker.recordUsage(model, promptTokens, completionTokens);
        return {
            text: fallbackText,
            tokensUsed: { prompt: promptTokens, completion: completionTokens, total: promptTokens + completionTokens },
            detectedLang,
            isPlan: mode === 'plan',
        };
    }
}
