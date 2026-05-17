import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'crm-portal-ts/src');

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Jeśli plik to main.ts, database.ts lub model common/customer - omijamy, zrobiliśmy to ręcznie
    if (filePath.endsWith('main.ts') || filePath.endsWith('database.ts') || 
        filePath.endsWith('models\\common.ts') || filePath.endsWith('models\\customer.ts')) {
        return;
    }

    // Szukamy bloków ```typescript ... ``` lub ```ts ... ```
    const regex = /```(?:typescript|ts)\n([\s\S]*?)```/i;
    const match = content.match(regex);

    if (match && match[1]) {
        // Podmieniamy zawartość pliku na sam wyodrębniony kod
        fs.writeFileSync(filePath, match[1].trim() + '\n', 'utf8');
        console.log(`Wyczyszczono: ${filePath}`);
    } else {
        // Jeśli nie ma znaczników, usuwamy ewentualny wstęp typu "Here is..."
        const lines = content.split('\n');
        const codeStart = lines.findIndex(line => line.startsWith('import ') || line.startsWith('export '));
        
        if (codeStart > 0) {
            const cleanContent = lines.slice(codeStart).join('\n');
            fs.writeFileSync(filePath, cleanContent.trim() + '\n', 'utf8');
            console.log(`Przycięto: ${filePath}`);
        }
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            cleanFile(fullPath);
        }
    }
}

console.log("Rozpoczynam czyszczenie plików TypeScript...");
traverseDir(srcDir);
console.log("Gotowe!");