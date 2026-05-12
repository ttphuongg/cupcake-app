import { ingredientModel, Ingredient } from '../models/index.js';

export const designService = {
    // Bước 1 UC Thiết kế: Lấy danh sách nguyên liệu và gắn cờ hết hàng
    getAvailableIngredients: async () => {
        // Lấy tất cả nguyên liệu (cả còn hàng và hết hàng)
        const allIngredients = await ingredientModel.findAll();

        // Định dạng lại dữ liệu và phân loại
        const result = {
            sizes: [] as any[],
            sugars: [] as any[],
            bases: [] as any[],
            fillings: [] as any[],
            frostings: [] as any[],
            toppings: [] as any[]
        };

        allIngredients.forEach((ing) => {
            const mappedItem = {
                id: ing.id,
                name: ing.name,
                price: Number(ing.price),
                image_url: ing.image_url,
                // Trả về cờ vô hiệu hóa nếu is_active = 0
                isOutOfStock: ing.is_active === 0
            };

            switch (ing.type) {
                case 'SIZE': result.sizes.push(mappedItem); break;
                case 'SUGAR': result.sugars.push(mappedItem); break;
                case 'BASE': result.bases.push(mappedItem); break;
                case 'FILLING': result.fillings.push(mappedItem); break;
                case 'FROSTING': result.frostings.push(mappedItem); break;
                case 'TOPPING': result.toppings.push(mappedItem); break;
            }
        });

        return result;
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
