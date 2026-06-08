import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import {
  Cake,
  Trophy,
  Sparkles,
  Ticket,
  Cookie,
  Apple,
  Leaf,
  Crown,
  MoreHorizontal
} from 'lucide-react-native';

import { Category } from '../types';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

interface CategoryGridProps {
  data: Category[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

export const CategoryGrid = ({
  data,
  onCategorySelect,
  selectedCategory,
}: CategoryGridProps) => {
  const [pageIndex, setPageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const CATEGORY_COLORS = ['#E8A0BF', '#B9A1D1', '#ADD4ED'];

  const getCategoryIcon = (name: string, color: string) => {
    const iconProps = { size: 28, color: Colors.white };
    const n = name.toLowerCase();

    if (n.includes('tất cả')) return <Cake {...iconProps} />;
    if (n.includes('bestseller')) return <Trophy {...iconProps} />;
    if (n.includes('mới')) return <Sparkles {...iconProps} />;
    if (n.includes('mã giảm giá') || n.includes('khuyến mãi')) return <Ticket {...iconProps} />;
    if (n.includes('chocolate')) return <Cookie {...iconProps} />;
    if (n.includes('trái cây') || n.includes('fruit')) return <Apple {...iconProps} />;
    if (n.includes('matcha')) return <Leaf {...iconProps} />;
    if (n.includes('cao cấp') || n.includes('premium')) return <Crown {...iconProps} />;

    return <Cake {...iconProps} />;
  };

  const ITEMS_PER_PAGE = 8;
  const allItem: Category = { id: undefined, name: 'Tất cả' };
  const enrichedData = [allItem, ...(data || [])];
  const pages = Math.ceil(enrichedData.length / ITEMS_PER_PAGE);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setPageIndex(index);
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {Array.from({ length: pages }).map((_, pIdx) => {
          const startIndex = pIdx * ITEMS_PER_PAGE;
          const pageCategories = enrichedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

          return (
            <View key={pIdx} style={styles.page}>
              <View style={styles.grid}>
                {pageCategories.map((category, idx) => {
                  const isSelected =
                    category.id === undefined
                      ? selectedCategory === null
                      : selectedCategory === category.id;

                  const colorIndex = idx % CATEGORY_COLORS.length;
                  const bgColor = CATEGORY_COLORS[colorIndex];

                  return (
                    <Animated.View
                      key={category.id ?? `all-${idx}`}
                      style={[styles.itemWrapper, { opacity: fadeAnim }]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => onCategorySelect(category.id ?? null)}
                        style={styles.button}
                      >
                        <View
                          style={[
                            styles.iconContainer,
                            {
                              backgroundColor: bgColor,
                              shadowOpacity: isSelected ? 0.4 : 0.1,
                              transform: [{ scale: isSelected ? 1.05 : 1 }],
                            },
                          ]}
                        >
                          {getCategoryIcon(category.name, bgColor)}
                        </View>

                        <Text
                          style={[
                            styles.text,
                            isSelected ? styles.textSelected : styles.textUnselected,
                          ]}
                          numberOfLines={2}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {pages > 1 && (
        <View style={styles.pagination}>
          {Array.from({ length: pages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === pageIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  page: {
    width,
    paddingHorizontal: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemWrapper: {
    width: '25%',
    marginBottom: 16,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  textSelected: {
    color: Colors.foreground,
    fontWeight: '600',
  },
  textUnselected: {
    color: Colors.mutedForeground,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(150,150,150,0.3)',
  },
});
