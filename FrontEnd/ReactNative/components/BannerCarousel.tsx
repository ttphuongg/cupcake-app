import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  link: string;
  bgGradient: string;
}

const banners: Banner[] = [
  {
    id: 'custom-design',
    title: 'Tự thiết kế bánh của bạn',
    subtitle: 'Sáng tạo bánh cupcake độc đáo với 30+ lựa chọn nguyên liệu',
    link: '/custom-design',
    bgGradient: 'from-secondary via-primary to-accent',
  },
  {
    id: 'promo-sweet10',
    title: 'Giảm 10% đơn đầu tiên',
    subtitle: 'Nhập mã SWEET10 khi thanh toán',
    link: '/',
    bgGradient: 'from-primary to-secondary',
  },
  {
    id: 'bestseller',
    title: 'Top Bestseller',
    subtitle: 'Red Velvet Romance - Được yêu thích nhất',
    link: '/product/4',
    bgGradient: 'from-accent to-primary',
  },
];

export const BannerCarousel = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: selectedIndex === 0 ? 6000 : 4000, stopOnInteraction: false })]
  );

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

  return (
    <div className="relative mb-6">
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner, index) => (
            <div key={banner.id} className="flex-[0_0_100%] min-w-0">
              <Link to={banner.link}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`bg-gradient-to-r ${banner.bgGradient} p-6 rounded-3xl shadow-xl min-h-[160px] flex flex-col justify-center`}
                >
                  <div className="flex items-start gap-4">
                    {index === 0 && (
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-8 h-8 text-secondary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {banner.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-3">{banner.subtitle}</p>
                      {index === 0 && (
                        <div className="inline-block bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold">
                          Bắt đầu →
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all rounded-full ${
              index === selectedIndex
                ? 'w-8 h-2 bg-primary'
                : 'w-2 h-2 bg-muted-foreground/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
