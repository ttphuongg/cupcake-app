import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// ── Middleware ──
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

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
