import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import { getCoreRouter } from './router_aggregator.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const app = express();
const port = 8080; // Changed to 8080 to match Nuxt proxy expectation
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for easier development with static files
}));
app.use(morgan('dev'));
app.use(express.json());
// Serve static files
app.use('/static', express.static(path.join(rootDir, 'static')));
// Initialize Database and Routes
const startServer = async () => {
    try {
        await initDatabase();
        // Register API routes
        app.use('/api', getCoreRouter());
        // Health check
        app.get('/health', (req, res) => {
            res.json({ status: 'ok', engine: 'TypeScript' });
        });
        // Fallback for dashboard
        app.get('/dashboard', (req, res) => {
            res.send(`<h1>CRM TS-Backend Dashboard Placeholder</h1>`);
        });
        app.listen(port, () => {
            console.log(`TS Backend running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=main.js.map