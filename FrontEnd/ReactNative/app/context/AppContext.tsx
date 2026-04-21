import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviews: Review[];
  inStock: boolean;
  stockQuantity?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  type: 'base' | 'filling' | 'frosting' | 'topping';
  price: number;
  inStock: boolean;
  stockQuantity: number;
  image?: string;
}

export interface CustomCake {
  id: string;
  size: 'small' | 'medium' | 'large';
  sugarLevel: 'low' | 'normal' | 'high';
  base: string;
  filling?: string;
  frosting: string;
  topping?: string;
  note?: string;
  totalPrice: number;
}

export interface CartItem {
  productId?: string;
  customCake?: CustomCake;
  quantity: number;
  customization?: {
    flavor?: string;
    frosting?: string;
    topping?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'reviewed';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  deliveryTime?: string;
  note?: string;
  discount?: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AppContextType {
  user: User | null;
  products: Product[];
  ingredients: Ingredient[];
  cart: CartItem[];
  orders: Order[];
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addToCart: (productId: string, quantity: number, customization?: CartItem['customization']) => { success: boolean; message: string };
  addCustomCakeToCart: (customCake: CustomCake, quantity: number) => { success: boolean; message: string };
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, quantity: number) => { success: boolean; message: string };
  clearCart: () => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>) => { success: boolean; orderId?: string; message: string };
  cancelOrder: (orderId: string) => boolean;
  addReview: (productId: string, review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  reorder: (orderId: string) => void;
  searchProducts: (query: string) => Product[];
  filterProducts: (category?: string, minPrice?: number, maxPrice?: number) => Product[];
  checkStock: (productId: string, quantity: number) => boolean;
  checkIngredientStock: (ingredientId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Vanilla Cupcake',
    price: 45000,
    description: 'Bánh cupcake vani cổ điển với kem bơ mịn màng',
    image: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=400&h=400&fit=crop',
    category: 'classic',
    rating: 4.8,
    reviews: [],
    inStock: true,
    stockQuantity: 50,
  },
  {
    id: '2',
    name: 'Chocolate Dream',
    price: 50000,
    description: 'Bánh chocolate đậm đà với ganache sô-cô-la',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=400&h=400&fit=crop',
    category: 'chocolate',
    rating: 4.9,
    reviews: [],
    inStock: true,
    stockQuantity: 40,
  },
  {
    id: '3',
    name: 'Strawberry Delight',
    price: 55000,
    description: 'Bánh dâu tươi ngon với kem phô mai',
    image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop',
    category: 'fruit',
    rating: 4.7,
    reviews: [],
    inStock: true,
    stockQuantity: 30,
  },
  {
    id: '4',
    name: 'Red Velvet Romance',
    price: 58000,
    description: 'Bánh red velvet mềm mịn với cream cheese frosting',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=400&fit=crop',
    category: 'special',
    rating: 5.0,
    reviews: [],
    inStock: true,
    stockQuantity: 25,
  },
  {
    id: '5',
    name: 'Lemon Zest',
    price: 48000,
    description: 'Bánh chanh tươi mát với lớp kem bơ chanh',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop',
    category: 'fruit',
    rating: 4.6,
    reviews: [],
    inStock: true,
    stockQuantity: 35,
  },
  {
    id: '6',
    name: 'Blueberry Bliss',
    price: 52000,
    description: 'Bánh việt quất tươi với kem vani',
    image: 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=400&h=400&fit=crop',
    category: 'fruit',
    rating: 4.7,
    reviews: [],
    inStock: true,
    stockQuantity: 20,
  },
  {
    id: '7',
    name: 'Matcha Heaven',
    price: 60000,
    description: 'Bánh matcha Nhật Bản với kem phô mai',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400&h=400&fit=crop',
    category: 'special',
    rating: 4.8,
    reviews: [],
    inStock: true,
    stockQuantity: 15,
  },
  {
    id: '8',
    name: 'Unicorn Magic',
    price: 65000,
    description: 'Bánh cupcake kỳ lân nhiều màu sắc',
    image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=400&h=400&fit=crop',
    category: 'special',
    rating: 4.9,
    reviews: [],
    inStock: true,
    stockQuantity: 10,
  },
];

const MOCK_INGREDIENTS: Ingredient[] = [
  // Base (Cốt bánh)
  { id: 'base-vanilla', name: 'Cốt vani', type: 'base', price: 15000, inStock: true, stockQuantity: 100 },
  { id: 'base-chocolate', name: 'Cốt chocolate', type: 'base', price: 18000, inStock: true, stockQuantity: 80 },
  { id: 'base-redvelvet', name: 'Cốt red velvet', type: 'base', price: 20000, inStock: true, stockQuantity: 60 },
  { id: 'base-matcha', name: 'Cốt matcha', type: 'base', price: 22000, inStock: true, stockQuantity: 40 },
  { id: 'base-lemon', name: 'Cốt chanh', type: 'base', price: 17000, inStock: true, stockQuantity: 50 },

  // Filling (Nhân)
  { id: 'fill-strawberry', name: 'Nhân dâu tươi', type: 'filling', price: 8000, inStock: true, stockQuantity: 70 },
  { id: 'fill-chocolate', name: 'Nhân chocolate', type: 'filling', price: 10000, inStock: true, stockQuantity: 80 },
  { id: 'fill-custard', name: 'Nhân custard', type: 'filling', price: 7000, inStock: true, stockQuantity: 90 },
  { id: 'fill-blueberry', name: 'Nhân việt quất', type: 'filling', price: 12000, inStock: true, stockQuantity: 30 },
  { id: 'fill-caramel', name: 'Nhân caramel', type: 'filling', price: 9000, inStock: false, stockQuantity: 0 },

  // Frosting (Kem)
  { id: 'frost-buttercream', name: 'Kem bơ', type: 'frosting', price: 12000, inStock: true, stockQuantity: 100 },
  { id: 'frost-cream-cheese', name: 'Kem phô mai', type: 'frosting', price: 15000, inStock: true, stockQuantity: 70 },
  { id: 'frost-whipped', name: 'Kem tươi', type: 'frosting', price: 13000, inStock: true, stockQuantity: 80 },
  { id: 'frost-ganache', name: 'Ganache chocolate', type: 'frosting', price: 18000, inStock: true, stockQuantity: 50 },

  // Topping (Trang trí)
  { id: 'top-sprinkles', name: 'Rắc nhiều màu', type: 'topping', price: 3000, inStock: true, stockQuantity: 200 },
  { id: 'top-choco-chips', name: 'Chocolate chip', type: 'topping', price: 5000, inStock: true, stockQuantity: 150 },
  { id: 'top-fruits', name: 'Trái cây tươi', type: 'topping', price: 8000, inStock: true, stockQuantity: 60 },
  { id: 'top-nuts', name: 'Hạt', type: 'topping', price: 6000, inStock: true, stockQuantity: 80 },
  { id: 'top-oreo', name: 'Oreo nghiền', type: 'topping', price: 7000, inStock: true, stockQuantity: 40 },
  { id: 'top-gold-leaf', name: 'Vàng lá', type: 'topping', price: 15000, inStock: false, stockQuantity: 0 },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [ingredients, setIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCart = localStorage.getItem('cart');
    const storedOrders = localStorage.getItem('orders');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      setUser({ id: foundUser.id, email: foundUser.email, name: foundUser.name, phone: foundUser.phone });
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      phone: '',
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser({ id: newUser.id, email: newUser.email, name: newUser.name, phone: newUser.phone });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex((u: any) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const checkStock = (productId: string, quantity: number): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return false;
    return (product.stockQuantity || 0) >= quantity;
  };

  const checkIngredientStock = (ingredientId: string): boolean => {
    const ingredient = ingredients.find(i => i.id === ingredientId);
    return ingredient ? ingredient.inStock && ingredient.stockQuantity > 0 : false;
  };

  const addToCart = (productId: string, quantity: number, customization?: CartItem['customization']): { success: boolean; message: string } => {
    const product = products.find(p => p.id === productId);

    if (!product) {
      return { success: false, message: 'Sản phẩm không tồn tại' };
    }

    if (!product.inStock) {
      return { success: false, message: 'Sản phẩm đã ngừng kinh doanh' };
    }

    const existingIndex = cart.findIndex(item => item.productId === productId);
    const existingQuantity = existingIndex >= 0 ? cart[existingIndex].quantity : 0;
    const totalQuantity = existingQuantity + quantity;

    if (!checkStock(productId, totalQuantity)) {
      const maxAvailable = product.stockQuantity || 0;
      return {
        success: false,
        message: `Chỉ còn ${maxAvailable} sản phẩm. Bạn đã có ${existingQuantity} trong giỏ hàng.`
      };
    }

    setCart(prev => {
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: totalQuantity, customization }
            : item
        );
      }
      return [...prev, { productId, quantity, customization }];
    });

    return { success: true, message: 'Đã thêm vào giỏ hàng' };
  };

  const addCustomCakeToCart = (customCake: CustomCake, quantity: number): { success: boolean; message: string } => {
    const requiredIngredients = [customCake.base, customCake.frosting];
    if (customCake.filling) requiredIngredients.push(customCake.filling);
    if (customCake.topping) requiredIngredients.push(customCake.topping);

    for (const ingId of requiredIngredients) {
      if (!checkIngredientStock(ingId)) {
        const ing = ingredients.find(i => i.id === ingId);
        return { success: false, message: `Nguyên liệu "${ing?.name}" đã hết hàng` };
      }
    }

    setCart(prev => [...prev, { customCake, quantity }]);
    return { success: true, message: 'Đã thêm bánh tùy chỉnh vào giỏ hàng' };
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateCartItem = (index: number, quantity: number): { success: boolean; message: string } => {
    if (quantity <= 0) {
      removeFromCart(index);
      return { success: true, message: 'Đã xóa khỏi giỏ hàng' };
    }

    const item = cart[index];
    if (item.productId) {
      if (!checkStock(item.productId, quantity)) {
        const product = products.find(p => p.id === item.productId);
        return {
          success: false,
          message: `Chỉ còn ${product?.stockQuantity || 0} sản phẩm`
        };
      }
    }

    setCart(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantity } : item
      )
    );
    return { success: true, message: 'Đã cập nhật số lượng' };
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt'>): { success: boolean; orderId?: string; message: string } => {
    if (!user) {
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    for (const item of orderData.items) {
      if (item.productId) {
        if (!checkStock(item.productId, item.quantity)) {
          const product = products.find(p => p.id === item.productId);
          return {
            success: false,
            message: `Sản phẩm "${product?.name}" không đủ số lượng trong kho`
          };
        }
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: `ORD${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return { success: true, orderId: newOrder.id, message: 'Đặt hàng thành công' };
  };

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'pending') {
      return false;
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o
      )
    );
    return true;
  };

  const addReview = (productId: string, review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
    if (!user) return;

    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
    };

    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, reviews: [...p.reviews, newReview] }
          : p
      )
    );
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, reviews: p.reviews.filter(r => r.id !== reviewId) }
          : p
      )
    );
  };

  const reorder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && product.inStock) {
          addToCart(item.productId, item.quantity, item.customization);
        }
      });
    }
  };

  const searchProducts = (query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  };

  const filterProducts = (category?: string, minPrice?: number, maxPrice?: number): Product[] => {
    return products.filter(p => {
      if (category && p.category !== category) return false;
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      return true;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        products,
        ingredients,
        cart,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addToCart,
        addCustomCakeToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        placeOrder,
        cancelOrder,
        addReview,
        deleteReview,
        reorder,
        searchProducts,
        filterProducts,
        checkStock,
        checkIngredientStock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
