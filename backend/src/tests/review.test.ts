import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

vi.mock('../config/db.js', () => ({
    default: {
        query: vi.fn(),
        execute: vi.fn(),
        getConnection: vi.fn()
    }
}));

vi.mock('jsonwebtoken', async (importOriginal) => {
    const actual = await importOriginal<typeof import('jsonwebtoken')>();
    return {
        ...actual,
        default: {
            ...actual,
            verify: vi.fn()
        },
        verify: vi.fn()
    };
});

describe('Module 7: Review System (Integration Tests)', () => {
    const mockToken = 'mock_valid_token';
    const mockUser = { id: 1, role: 'user' };

    beforeEach(() => {
        vi.clearAllMocks();
        (jwt.verify as any).mockReturnValue(mockUser);
    });

    describe('GET /api/v1/reviews/check/:productId', () => {
        it('REV-F-005: Should return hasReviewed: true if order is reviewed', async () => {
            (pool.query as any).mockImplementation(async (query: string) => {
                if (query.includes('FROM Users')) return [[mockUser]];
                if (query.includes('SELECT * FROM Reviews')) return [[{ id: 1 }]];
                return [[]];
            });

            const response = await request(app)
                .get('/api/v1/reviews/check/1?orderId=1')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.hasReviewed).toBe(true);
        });

        it('REV-F-006: Should return hasReviewed: false if order is not reviewed', async () => {
            (pool.query as any).mockImplementation(async (query: string) => {
                if (query.includes('FROM Users')) return [[mockUser]];
                if (query.includes('SELECT * FROM Reviews')) return [[]];
                return [[]];
            });

            const response = await request(app)
                .get('/api/v1/reviews/check/1?orderId=2')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.hasReviewed).toBe(false);
        });
    });

    describe('POST /api/v1/reviews/:productId', () => {
        it('REV-F-001: Should create a review for COMPLETED order', async () => {
            (pool.query as any).mockImplementation(async (query: string) => {
                if (query.includes('FROM Users')) return [[mockUser]];
                if (query.includes('FROM OrderItems')) return [[{ id: 1, status: 'completed' }]];
                if (query.includes('FROM Reviews')) return [[]]; // not reviewed
                return [[]];
            });
            (pool.execute as any).mockResolvedValue([{ insertId: 1 }]);

            const response = await request(app)
                .post('/api/v1/reviews/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    orderId: 1,
                    rating: 5,
                    comment: 'Great!'
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Đánh giá đơn hàng thành công');
        });

        it('REV-N-001: Should fail if order is not COMPLETED (e.g. PENDING)', async () => {
            (pool.query as any).mockImplementation(async (query: string) => {
                if (query.includes('FROM Users')) return [[mockUser]];
                if (query.includes('FROM OrderItems')) return [[]]; // Empty or pending
                return [[]];
            });

            const response = await request(app)
                .post('/api/v1/reviews/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    orderId: 1,
                    rating: 5,
                    comment: 'Great!'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Bạn cần mua và nhận hàng thành công để đánh giá');
        });

        it('REV-N-002: Should fail if duplicate review', async () => {
            (pool.query as any).mockImplementation(async (query: string) => {
                if (query.includes('FROM Users')) return [[mockUser]];
                if (query.includes('FROM OrderItems')) return [[{ id: 1, status: 'completed' }]];
                if (query.includes('FROM Reviews')) return [[{ id: 1 }]]; // Already reviewed
                return [[]];
            });

            const response = await request(app)
                .post('/api/v1/reviews/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    orderId: 1,
                    rating: 5,
                    comment: 'Duplicate'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Bạn đã đánh giá');
        });

        it('REV-N-003 & REV-N-004: Should fail if rating is missing or out of bounds', async () => {
            (pool.query as any).mockImplementation(async (query: string) => {
                if (query.includes('FROM Users')) return [[mockUser]];
                return [[]];
            });

            const response = await request(app)
                .post('/api/v1/reviews/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    orderId: 1,
                    rating: 6,
                    comment: 'Bad rating'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Vui lòng chọn số sao hợp lệ từ 1 đến 5');
        });
    });
});
