import { useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Search, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { BannerCarousel } from '../components/BannerCarousel';
import { CategoryGrid } from '../components/CategoryGrid';

type SortType = 'popular' | 'price-asc' | 'price-desc' | 'rating';

export const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, cart, addToCart, updateCartItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortType, setSortType] = useState<SortType>('popular');

  const [flyingDots, setFlyingDots] = useState<Array<{ id: number; startX: number; startY: number }>>([]);
  const [cartBounce, setCartBounce] = useState(false);
  const cartIconRef = useRef<HTMLDivElement>(null);

  const getCartQuantity = (productId: string) => {
    const cartIndex = cart.findIndex(item => item.productId === productId);
    return cartIndex >= 0 ? cart[cartIndex].quantity : 0;
  };

const handleUpdateQuantity = (productId: string, delta: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartIndex = cart.findIndex(item => item.productId === productId);
    if (cartIndex >= 0) {
      const newQuantity = cart[cartIndex].quantity + delta;
      
      // 1. CẬP NHẬT SỐ LƯỢNG VÀ HIỆU ỨNG NẢY GIỎ HÀNG NGAY LẬP TỨC
      updateCartItem(cartIndex, newQuantity);
      
      if (delta > 0) {
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 300);

        // 2. TẠO HẠT BAY SONG SONG
        const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const dotId = Date.now();
        setFlyingDots(prev => [...prev, { 
          id: dotId, 
          startX: buttonRect.left + buttonRect.width / 2, 
          startY: buttonRect.top + buttonRect.height / 2 
        }]);

        // 3. CHỈ DÙNG TIMEOUT ĐỂ XÓA HẠT ĐẬU SAU KHI BAY XONG
        setTimeout(() => {
          setFlyingDots(prev => prev.filter(dot => dot.id !== dotId));
        }, 700); 
      }
    }
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. CẬP NHẬT NGAY LẬP TỨC
    addToCart(productId, 1);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 300);

    // 2. TẠO HẠT BAY
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dotId = Date.now();
    setFlyingDots(prev => [...prev, { 
      id: dotId, 
      startX: buttonRect.left + buttonRect.width / 2, 
      startY: buttonRect.top + buttonRect.height / 2 
    }]);
    
    // 3. XÓA HẠT ĐẬU SAU KHI HOÀN TẤT ANIMATION
    setTimeout(() => {
      setFlyingDots(prev => prev.filter(dot => dot.id !== dotId));
    }, 700);
  };

  const searchQuery = searchParams.get('search') || '';

  const displayProducts = [...products]
    .filter(p => {
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortType === 'price-asc') return a.price - b.price;
      if (sortType === 'price-desc') return b.price - a.price;
      if (sortType === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="pb-24 bg-[#fdfaf9] min-h-screen relative overflow-clip">
      
      {/* THANH SEARCH CỐ ĐỊNH - Đã đổi sang màu hồng giống Shopee */}
      <div className="sticky top-0 z-[100] bg-primary px-6 pt-10 pb-5 shadow-md"> 
        <div
          onClick={() => navigate('/search')}
          className="bg-white rounded-xl flex items-center px-4 py-2.5 shadow-sm cursor-pointer active:scale-[0.98] transition-all"
        >
          <Search className="w-5 h-5 text-primary/60 mr-3" />
          <span className="text-muted-foreground/70 text-sm font-medium truncate">
            {searchQuery || 'Tìm kiếm bánh cupcake...'}
          </span>
        </div>
      </div>

      <div className="px-6 space-y-6 mt-4"> {/* Thêm mt-4 để tạo khoảng cách với header mới */}
        {!searchQuery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <BannerCarousel />
            <CategoryGrid
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </motion.div>
        )}

        {/* BỘ LỌC */}
        <div className="sticky top-[88px] z-[90] bg-[#fdfaf9] py-2 -mx-6 px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
            {[
              { id: 'popular', label: 'Phổ biến' },
              { id: 'price-asc', label: 'Giá thấp' },
              { id: 'price-desc', label: 'Giá cao' },
              { id: 'rating', label: 'Đánh giá' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSortType(filter.id as SortType)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-xs font-bold border transition-all ${
                  sortType === filter.id
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-muted-foreground border-border/40'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* GRID SẢN PHẨM */}
        <div className="grid grid-cols-2 gap-3 pb-10">
          {displayProducts.map((p, i) => {
            const quantity = getCartQuantity(p.id);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-border/40 flex flex-col h-full"
              >
                <Link to={`/product/${p.id}`} className="aspect-square w-full relative bg-muted">
                  <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                  {/* ĐÃ XÓA DÒNG "YÊU THÍCH" TẠI ĐÂY */}
                </Link>
                <div className="p-2.5 flex flex-col flex-1">
                  <h3 className="text-[13px] font-bold text-foreground line-clamp-2 min-h-[36px] leading-tight">{p.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="text-primary font-black text-sm">{p.price.toLocaleString()}đ</span>
                    {quantity === 0 ? (
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => handleAddToCart(p.id, e)}
                        className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-sm"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-primary/10 rounded-lg p-1 border border-primary/20">
                        <button onClick={(e) => handleUpdateQuantity(p.id, -1, e)} className="w-5 h-5 bg-primary text-white rounded-md flex items-center justify-center"><Minus size={12} strokeWidth={3} /></button>
                        <span className="text-[11px] font-black text-primary min-w-[14px] text-center">{quantity}</span>
                        <button onClick={(e) => handleUpdateQuantity(p.id, 1, e)} className="w-5 h-5 bg-primary text-white rounded-md flex items-center justify-center"><Plus size={12} strokeWidth={3} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

{/* HIỆU ỨNG BAY QUỸ ĐẠO CONG */}
<AnimatePresence>
  {flyingDots.map(dot => {
    const cartRect = cartIconRef.current?.getBoundingClientRect();
    
    // Tính toán lại fallback khớp với vị trí FAB: right-6 (24px) và bottom-24 (96px), kích thước w-14 (56px)
    // Tâm X: Chiều rộng màn hình - 24px (margin) - 28px (nửa nút) = window.innerWidth - 52
    // Tâm Y: Chiều cao màn hình - 96px (margin) - 28px (nửa nút) = window.innerHeight - 124
    const targetX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 52; 
    const targetY = cartRect ? cartRect.top + cartRect.height / 2 : window.innerHeight - 124;

    return (
      <motion.div
        key={dot.id}
        style={{ position: 'fixed', left: 0, top: 0, width: 22, height: 22, zIndex: 9999 }}
        initial={{ x: dot.startX - 11, y: dot.startY - 11, opacity: 1, scale: 1 }}
        animate={{ 
          x: targetX - 11, 
          y: targetY - 11, 
          scale: [1, 0.9, 0.3], 
          opacity: [1, 1, 0] 
        }}
        transition={{ 
          duration: 0.65, 
          x: { ease: "easeOut" }, 
          y: { ease: "easeIn" },  
          scale: { duration: 0.65 },
          opacity: { duration: 0.65, ease: "easeIn" }
        }}
        className="bg-primary rounded-full border-2 border-white shadow-lg pointer-events-none flex items-center justify-center"
      >
         <Plus size={12} className="text-white" strokeWidth={4} />
      </motion.div>
    );
  })}
</AnimatePresence>

      {/* GIỎ HÀNG NỔI */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            ref={cartIconRef}
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, ...(cartBounce ? { scale: [1, 1.4, 1] } : {}) }}
            exit={{ scale: 0, y: 20, opacity: 0 }}
            className="fixed bottom-24 right-6 z-[110]"
          >
            <Link to="/cart">
              <div className="w-14 h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center relative text-white active:scale-90 transition-transform" style={{ boxShadow: '0 8px 25px -5px rgba(255, 107, 129, 0.5)' }}>
                <ShoppingBag size={24} />
                <motion.span key={cart.reduce((s, i) => s + i.quantity, 0)} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-white text-primary text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-primary">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </motion.span>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};