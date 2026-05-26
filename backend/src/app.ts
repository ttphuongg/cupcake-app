import express, { Request, Response, NextFunction } from 'express';
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
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ── Routes ──
app.use('/api/v1', apiRouter);

// ── Health check ──
app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: 'Backend API đang hoạt động',
        version: '1.0.0',
    });
});

// ── 404 handler ──
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: `Không tìm thấy route: ${req.method} ${req.path}` });
});

// ── Global error handler ──
app.use(errorHandler);

export default app;
