import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const app = express();
const port = 8081;

// Serve static files from the old framework
app.use('/static', express.static(path.join(rootDir, 'static')));

// Placeholder for the dashboard
app.get('/dashboard', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>CRM TS-Backend</title>
        <link rel="stylesheet" href="/static/css/output.css?v=1.1">
        <style>body { background: transparent; padding: 2rem; font-family: sans-serif; }</style>
      </head>
      <body>
        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h1 class="text-2xl font-bold text-primary-600 mb-4">TypeScript Backend (W trakcie migracji)</h1>
          <p class="text-gray-600 dark:text-gray-300">
            Ollama przetłumaczył i uruchomił ten widok z nowego serwera Express/TS na porcie ${port}. 
            Tłumaczenie pozostałych modułów trwa w tle...
          </p>
          <div class="mt-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <i class="fas fa-check-circle mr-2"></i> Serwer TS działa poprawnie!
          </div>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`TS Backend running on http://localhost:${port}`);
});
