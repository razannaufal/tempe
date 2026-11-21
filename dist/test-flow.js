import { ConfigManager } from './core/config.js';
import { UsageTracker } from './core/usage.js';
import { HistoryManager } from './core/history.js';
import { LanguageDetector } from './agent/prompt-lang.js';
console.log('=== TEST TEMPE CORE FLOW ===');
// 1. Test Language Detection
const indonesianPrompt = 'Tolong buatkan endpoint REST API untuk login pengguna';
const englishPrompt = 'Please create a REST API endpoint for user authentication';
console.log('Lang ID:', LanguageDetector.detect(indonesianPrompt));
console.log('Lang EN:', LanguageDetector.detect(englishPrompt));
// 2. Add API Key
ConfigManager.addApiKey('Test Key Gemini', 'gemini', 'AIzaSyDemoKeyTest12345');
const config = ConfigManager.load();
console.log('Config API Keys count:', config.apiKeys.length);
// 3. Record Usage
UsageTracker.recordUsage('gemini-2.5-flash', 1500, 3200);
UsageTracker.recordUsage('gpt-4o', 800, 1200);
// 4. Record History
HistoryManager.add({
    mode: 'plan',
    model: 'gemini-2.5-flash',
    prompt: indonesianPrompt,
    response: '1. Buat controller\n2. Buat service\n3. Buat route',
    tokens: 4700,
});
console.log('\n--- USAGE REPORT ---');
console.log(UsageTracker.renderUsageReport());
console.log('\n--- HISTORY REPORT ---');
console.log(HistoryManager.renderList(5));
console.log('=== TEST COMPLETED SUCCESSFULLY ===');
