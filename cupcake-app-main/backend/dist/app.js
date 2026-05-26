import express from 'express';
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