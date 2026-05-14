import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ingredient } from '../../types';
import { Colors } from '../../constants/theme';

const { width } = Dimensions.get('window');

const PAGE_PADDING = 20;
const GAP = 12;
/** Chiều rộng mỗi card = (màn hình - 2×lề - khoảng cách) / 2 */
const ITEM_WIDTH = (width - PAGE_PADDING * 2 - GAP) / 2;
/** 6 item / trang = lưới 2 cột × 3 hàng */
const ITEMS_PER_PAGE = 6;

// ─── Types ──────────────────────────────────────────────────────────────────

interface IngredientSelectorProps {
  data: Ingredient[];
  /** Ingredient đơn (BASE/FROSTING/SUGAR) hoặc mảng (TOPPING). null = chưa chọn */
  selected: Ingredient | Ingredient[] | null;
  onSelect: (ingredient: Ingredient) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatPrice = (price: number): string =>
  price >= 1000 ? `+${price / 1000}k` : `+${price}đ`;

const isIngredientSelected = (
  ingredient: Ingredient,
  selected: Ingredient | Ingredient[] | null,
): boolean => {
  if (!selected) return false;
  if (Array.isArray(selected)) return selected.some((s) => s.id === ingredient.id);
  return selected.id === ingredient.id;
};

// ─── Sub-component: IngredientCard ──────────────────────────────────────────

interface IngredientCardProps {
  ingredient: Ingredient;
  active: boolean;
  onPress: () => void;
}

const IngredientCard = ({ ingredient, active, onPress }: IngredientCardProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.card, active && styles.activeCard]}
  >
    <Text style={[styles.name, active && styles.activeText]}>{ingredient.name}</Text>
    <Text style={[styles.price, active && styles.activeText]}>{formatPrice(ingredient.price)}</Text>
  </TouchableOpacity>
);

// ─── Sub-component: PageDots ─────────────────────────────────────────────────

interface PageDotsProps {
  count: number;
  activeIndex: number;
}

const PageDots = ({ count, activeIndex }: PageDotsProps) => (
  <View style={styles.pagination}>
    {Array.from({ length: count }, (_, i) => (
      <View
        key={i}
        style={[styles.dot, i === activeIndex ? styles.activeDot : styles.inactiveDot]}
      />
    ))}
  </View>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const IngredientSelector = ({ data, selected, onSelect }: IngredientSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pages = useMemo<Ingredient[][]>(() => {
    const result: Ingredient[][] = [];
    for (let i = 0; i < (data?.length ?? 0); i += ITEMS_PER_PAGE) {
      result.push(data.slice(i, i + ITEMS_PER_PAGE));
    }
    return result;
  }, [data]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderPage = ({ item: pageItems }: { item: Ingredient[] }) => (
    <View style={[styles.pageContainer, { width }]}>
      <View style={styles.grid}>
        {pageItems.map((ingredient) => {
          if (!ingredient.id) return null;
          return (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              active={isIngredientSelected(ingredient, selected)}
              onPress={() => onSelect(ingredient)}
            />
          );
        })}
      </View>
    </View>
  );

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        renderItem={renderPage}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
      />

      {pages.length > 1 && (
        <PageDots count={pages.length} activeIndex={currentIndex} />
      )}
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    paddingHorizontal: PAGE_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: Colors.inputBackground,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  activeCard: {
    backgroundColor: Colors.card,
    borderColor: Colors.primary,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.foreground,
  },
  price: {
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 3,
  },
  activeText: {
    color: Colors.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 3,
  },
  dot: {
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
    transform: [{ translateY: 0 }],
  },
  activeDot: {
    width: 5,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});


