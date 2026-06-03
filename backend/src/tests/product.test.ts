import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

vi.mock('../config/db.js', () => ({
    default: {
        query: vi.fn(),
        execute: vi.fn(),
        getConnection: vi.fn()
    }
}));

describe('Module 3: Product Catalog (Integration Tests)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/v1/products/search', () => {
        it('PROD-F-001 & PROD-F-002: Should return list of active products and support search', async () => {
            const mockProducts = [
                { id: 1, name: 'Chocolate Cupcake', price: 30000, is_active: 1, category_name: 'Cupcake' },
                { id: 2, name: 'Vanilla Cupcake', price: 25000, is_active: 1, category_name: 'Cupcake' }
            ];

            (pool.query as any).mockResolvedValueOnce([mockProducts]);

            const response = await request(app)
                .get('/api/v1/products/search?keyword=cupcake')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].name).toBe('Chocolate Cupcake');
        });

        it('PROD-F-003 & PROD-F-004: Should support filter by category and price range', async () => {
            const mockProducts = [
                { id: 1, name: 'Premium Cupcake', price: 60000, is_active: 1, category_id: 1 }
            ];

            (pool.query as any).mockResolvedValueOnce([mockProducts]);

            const response = await request(app)
                .get('/api/v1/products/search?categoryId=1&minPrice=50000&maxPrice=100000')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });

        it('PROD-N-004: Should return empty array if min > max or impossible range', async () => {
            (pool.query as any).mockResolvedValueOnce([[]]);

            const response = await request(app)
                .get('/api/v1/products/search?minPrice=500000&maxPrice=10000')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('GET /api/v1/products/:id', () => {
        it('PROD-F-005: Should get product details for valid ID', async () => {
            const mockProduct = { id: 1, name: 'Chocolate Cupcake', price: 30000, is_active: 1, stock: 10 };
            
            // Mock findById
            (pool.query as any).mockResolvedValueOnce([[mockProduct]]);
            // Mock reviews
            (pool.query as any).mockResolvedValueOnce([[]]);

            const response = await request(app)
                .get('/api/v1/products/1')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Chocolate Cupcake');
        });

        it('PROD-N-001: Should return 404 for non-existent product', async () => {
            (pool.query as any).mockResolvedValueOnce([[]]);

            const response = await request(app)
                .get('/api/v1/products/999999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('không tồn tại');
        });

        it('PROD-N-002: Should return 400 for invalid product ID format', async () => {
            const response = await request(app)
                .get('/api/v1/products/abc')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('ID sản phẩm không hợp lệ');
        });
    });
});
