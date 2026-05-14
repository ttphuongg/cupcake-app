import { ingredientModel, Ingredient } from '../models/index.js';

export const designService = {
    // Bước 1 UC Thiết kế: Lấy danh sách nguyên liệu và gắn cờ hết hàng
    getAvailableIngredients: async () => {
        // Lấy tất cả nguyên liệu
        const allIngredients = await ingredientModel.findAll();

        // Trả về mảng phẳng các nguyên liệu đã được map lại format
        return allIngredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            type: ing.type,
            price: Number(ing.price),
            image_url: ing.image_url,
            is_active: ing.is_active,
            priority: ing.priority ?? null,
            isOutOfStock: ing.is_active === 0
        }));
    },

    // Hàm bổ sung: Kiểm tra tính hợp lệ của gói cấu hình bánh thiết kế
    validateDesign: async (ingredientIds: number[]) => {
        if (!ingredientIds || ingredientIds.length === 0) {
            throw new Error('Bạn chưa chọn nguyên liệu nào');
        }

        const ingredients: Ingredient[] = [];
        for (const id of ingredientIds) {
            const ing = await ingredientModel.findById(id);
            if (!ing) {
                throw new Error(`Nguyên liệu không tồn tại (ID: ${id})`);
            }
            if (ing.is_active === 0) {
                throw new Error(`Nguyên liệu "${ing.name}" hiện đang hết hàng`);
            }
            ingredients.push(ing);
        }

        const hasBase = ingredients.some(i => i.type === 'BASE');
        const hasFrosting = ingredients.some(i => i.type === 'FROSTING');
        const hasSize = ingredients.some(i => i.type === 'SIZE');

        // Ràng buộc nghiệp vụ: Một chiếc bánh tối thiểu phải có Cốt bánh, Lớp kem (Frosting) và Size
        if (!hasBase) {
            throw new Error('Vui lòng chọn Cốt bánh');
        }
        if (!hasFrosting) {
            throw new Error('Vui lòng chọn Kem (Frosting)');
        }
        if (!hasSize) {
            throw new Error('Vui lòng chọn Kích thước (Size)');
        }

        return ingredients;
    },

    // Bước 3 UC Thiết kế: Tính tổng tiền thực tế dựa trên các nguyên liệu
    calculateCustomPrice: async (ingredientIds: number[]) => {
        // Tái sử dụng hàm validateDesign để lấy ra danh sách nguyên liệu hợp lệ
        const validIngredients = await designService.validateDesign(ingredientIds);

        let totalPrice = 0;
        validIngredients.forEach(ing => {
            totalPrice += Number(ing.price);
        });

        return {
            totalPrice,
            ingredients: validIngredients
        };
    }
};
