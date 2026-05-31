import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Kết nối Database
        await connectDB();

        // Lắng nghe các request từ App
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server đang chạy tại: http://0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error('Không thể khởi động server:', error);
        process.exit(1);
    }
};

startServer();