import readline from 'readline';
import fs from 'fs';
import path from 'path';
const projectRoot = path.resolve(process.cwd(), '../');
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen-940mx';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const systemPrompt = `You are an elite TypeScript/Vue Architect. Your goal is to write full, working code files based on user requests.
CRITICAL RULES:
1. You MUST precede EVERY code block with exactly this format: "### FILE: relative/path/to/file.ext"
2. Example: 
### FILE: crm-portal-ts/src/models/car.ts
\`\`\`typescript
export class Car { ... }
\`\`\`
3. Provide NO explanations. ONLY the file definitions and code.
4. Backend files should go to: crm-portal-ts/src/models/... or crm-portal-ts/src/routers/...
5. Frontend files should go to: crm-portal-ts/frontend/app/pages/...
Follow this format strictly so the automated system can write the files to disk.`;
let conversationHistory = [{ role: 'system', content: systemPrompt }];
async function askOllama(prompt) {
    conversationHistory.push({ role: 'user', content: prompt });
    try {
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                messages: conversationHistory,
                stream: false
            })
        });
        if (!response.ok)
            throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        const content = data.message.content;
        conversationHistory.push({ role: 'assistant', content });
        return content;
    }
    catch (err) {
        console.error("❌ Błąd połączenia z Ollamą:", err.message);
        return null;
    }
}
function extractAndSaveFiles(content) {
    const fileRegex = /###\s*FILE:\s*(.+?)\n```[\w]*\n([\s\S]*?)```/g;
    let match;
    let filesCreated = 0;
    while ((match = fileRegex.exec(content)) !== null) {
        const relativeFilePath = match[1].trim();
        const fileContent = match[2].trim();
        const fullPath = path.resolve(projectRoot, relativeFilePath);
        if (!fullPath.startsWith(projectRoot)) {
            console.warn(`⚠️ Pominięto niebezpieczną ścieżkę: ${relativeFilePath}`);
            continue;
        }
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, fileContent + '\n', 'utf8');
        console.log(`✅ Utworzono plik: ${relativeFilePath}`);
        filesCreated++;
    }
    if (filesCreated === 0) {
        console.log("⚠️ Nie znaleziono żadnych plików do wygenerowania w odpowiedzi modelu.");
    }
}
console.log("\n=============================================");
console.log("🚀 Witaj w CLI AI Architekta (Powered by Ollama)");
console.log("=============================================");
console.log("Opisz moduł, który chcesz utworzyć (np. 'Zrób prosty CRM dla aut').");
console.log("Wpisz 'exit', aby zakończyć.\n");
function promptUser() {
    rl.question('Ty: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
            rl.close();
            return;
        }
        console.log("🤖 Architekt myśli (Generowanie modułów na GPU)...");
        const response = await askOllama(input);
        if (response) {
            console.log("\n--- ODPOWIEDŹ ARCHITEKTA ---");
            console.log(response);
            console.log("----------------------------\n");
            rl.question('Czy wdrożyć i zapisać te pliki na dysku? (t/N): ', (answer) => {
                if (answer.toLowerCase() === 't' || answer.toLowerCase() === 'tak') {
                    extractAndSaveFiles(response);
                }
                else {
                    console.log("❌ Anulowano zapis plików.");
                }
                console.log("\nCzego potrzebujesz dalej?");
                promptUser();
            });
        }
        else {
            promptUser();
        }
    });
}
promptUser();
//# sourceMappingURL=architect_cli.js.map