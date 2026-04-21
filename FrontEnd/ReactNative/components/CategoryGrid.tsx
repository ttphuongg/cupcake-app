import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Trophy, Star, Tag, Gift, Cake, Coffee, Heart, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const categories: Category[] = [
  { id: 'all', name: 'Tất cả', icon: Cake, color: 'bg-primary' },
  { id: 'bestseller', name: 'Bestseller', icon: Trophy, color: 'bg-secondary' },
  { id: 'new', name: 'Mới', icon: Sparkles, color: 'bg-accent' },
  { id: 'voucher', name: 'Mã giảm giá', icon: Tag, color: 'bg-primary' },
  { id: 'chocolate', name: 'Chocolate', icon: Coffee, color: 'bg-secondary' },
  { id: 'fruit', name: 'Trái cây', icon: Gift, color: 'bg-accent' },
  { id: 'matcha', name: 'Matcha', icon: Heart, color: 'bg-primary' },
  { id: 'premium', name: 'Cao cấp', icon: Crown, color: 'bg-secondary' },
];

interface CategoryGridProps {
  onCategorySelect: (categoryId: string) => void;
  selectedCategory: string;
}

export const CategoryGrid = ({ onCategorySelect, selectedCategory }: CategoryGridProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' });

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Chia categories thành các trang, mỗi trang 8 items (2 hàng x 4 cột)
  const itemsPerPage = 8;
  const pages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="mb-6">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {Array.from({ length: pages }).map((_, pageIndex) => {
            const startIndex = pageIndex * itemsPerPage;
            const pageCategories = categories.slice(startIndex, startIndex + itemsPerPage);

            return (
              <div key={pageIndex} className="flex-[0_0_100%] min-w-0">
                <div className="grid grid-cols-4 gap-4 px-1">
                  {pageCategories.map((category, index) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;

                    return (
                      <motion.button
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCategorySelect(category.id)}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl ${category.color} ${
                            isSelected ? 'shadow-lg' : 'shadow-sm'
                          } ${
                            isSelected ? 'bg-opacity-100' : 'bg-opacity-10'
                          } flex items-center justify-center transition-all`}
                        >
                          <Icon
                            className={`w-7 h-7 ${
                              isSelected ? 'text-white' : 'text-primary'
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs text-center ${
                            isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground'
                          }`}
                        >
                          {category.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all rounded-full ${
                index === selectedIndex
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-muted-foreground/30'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
