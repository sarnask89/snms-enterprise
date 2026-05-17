import { Router } from "express";
import fs from "fs";
import path from "path";
export const router = Router();
// Zmienna przechowująca ścieżkę do głównego katalogu projektu (zakładamy uruchomienie z crm-portal/crm-portal-ts)
const projectRoot = path.resolve(process.cwd(), '../');
router.post("/implement", async (req, res) => {
    try {
        const { spec } = req.body;
        if (!spec) {
            return res.status(400).json({ message: "Brak specyfikacji do wdrożenia." });
        }
        // Ekspresowy parser. Szukamy wzorca:
        // ### FILE: crm-portal-ts/src/models/test.ts
        // ```typescript
        // kod...
        // ```
        const filesCreated = [];
        const fileRegex = /###\s*FILE:\s*(.+?)\n```[\w]*\n([\s\S]*?)```/g;
        let match;
        while ((match = fileRegex.exec(spec)) !== null) {
            const relativeFilePath = match[1].trim();
            const fileContent = match[2].trim();
            // Bezpieczne łączenie ścieżek
            const fullPath = path.resolve(projectRoot, relativeFilePath);
            // Zabezpieczenie przed wyjściem poza katalog projektu (Path Traversal)
            if (!fullPath.startsWith(projectRoot)) {
                console.warn(`Pominięto niebezpieczną ścieżkę: ${relativeFilePath}`);
                continue;
            }
            // Tworzenie folderów, jeśli nie istnieją
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            // Zapis pliku
            fs.writeFileSync(fullPath, fileContent + '\n', 'utf8');
            filesCreated.push(relativeFilePath);
        }
        if (filesCreated.length === 0) {
            return res.status(400).json({
                message: "Nie znaleziono definicji plików w specyfikacji. AI musi użyć formatu: '### FILE: ścieżka' przed blokiem kodu."
            });
        }
        res.json({
            message: "Wdrożenie zakończone sukcesem!",
            files: filesCreated
        });
    }
    catch (error) {
        console.error("Błąd w module Architekta:", error);
        res.status(500).json({ message: "Wewnętrzny błąd serwera podczas zapisywania plików.", error: error.message });
    }
});
//# sourceMappingURL=architect.js.map