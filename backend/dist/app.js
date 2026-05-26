import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// ── Middleware ──
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow cross-origin image requests so the React Native app can load uploaded images
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Log request để debug
app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});
// ── Routes ──
app.use('/api/v1', apiRouter);
// ── Health check ──
app.get('/', (_req, res) => {
    res.json({
        message: 'Backend API đang hoạt động',
        version: '1.0.0',
    });
});
// ── 404 handler ──
app.use((req, res) => {
    res.status(404).json({ message: `Không tìm thấy route: ${req.method} ${req.path}` });
});
// ── Global error handler ──
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map