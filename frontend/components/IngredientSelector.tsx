import React, { useState } from 'react';
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
import { Ingredient } from '../types';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

const PAGE_PADDING = 20;
const GAP = 12;
/** Chiều rộng mỗi card = (màn hình - 2×lề - khoảng cách) / 2 */
const ITEM_WIDTH = (width - PAGE_PADDING * 2 - GAP) / 2;

/** 6 item / trang = lưới 2 cột × 3 hàng */
const ITEMS_PER_PAGE = 6;

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
  if (Array.isArray(selected)) {
    return selected.some((s) => s.id === ingredient.id);
  }
  return selected.id === ingredient.id;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const IngredientSelector = ({
  data,
  selected,
  onSelect,
}: IngredientSelectorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Phân mảng data thành các trang, mỗi trang 6 item
  const pages: Ingredient[][] = [];
  for (let i = 0; i < (data?.length ?? 0); i += ITEMS_PER_PAGE) {
    pages.push(data.slice(i, i + ITEMS_PER_PAGE));
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderPage = ({ item: pageItems }: { item: Ingredient[] }) => (
    <View style={[styles.pageContainer, { width }]}>
      <View style={styles.grid}>
        {pageItems.map((ingredient) => {
          if (!ingredient.id) return null;
          const active = isIngredientSelected(ingredient, selected);

          return (
            <TouchableOpacity
              key={ingredient.id}
              activeOpacity={0.7}
              onPress={() => onSelect(ingredient)}
              style={[styles.card, active && styles.activeCard]}
            >
              <Text style={[styles.name, active && styles.activeText]}>
                {ingredient.name}
              </Text>
              <Text style={[styles.price, active && styles.activeText]}>
                {formatPrice(ingredient.price)}
              </Text>
            </TouchableOpacity>
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

      {/* Dots — chỉ hiện khi có > 1 trang */}
      {pages.length > 1 && (
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  pageContainer: {
    paddingHorizontal: PAGE_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 12,
    columnGap: GAP,
  },
  card: {
    width: ITEM_WIDTH,
    backgroundColor: Colors.inputBackground,
    paddingVertical: 16,
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
    fontWeight: '600',
    color: Colors.foreground,
  },
  price: {
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 4,
  },
  activeText: {
    color: Colors.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
