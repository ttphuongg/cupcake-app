import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';

type SortType = 'popular' | 'price-asc' | 'price-desc';

interface HomeFilterPillsProps {
  sortType: SortType;
  setSortType: (sort: SortType) => void;
}

export const HomeFilterPills: React.FC<HomeFilterPillsProps> = ({ sortType, setSortType }) => {
  const filters: { id: SortType | 'rating'; label: string }[] = [
    { id: 'popular', label: 'Phổ biến' },
    { id: 'rating', label: 'Đánh giá' },
    { id: 'price-asc', label: 'Giá thấp' },
    { id: 'price-desc', label: 'Giá cao' },
  ];

  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {filters.map((f) => {
          const active = sortType === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => f.id !== 'rating' && setSortType(f.id as SortType)}
              style={[styles.filterButton, active ? styles.filterActive : styles.filterInactive]}
            >
              <Text style={[styles.filterText, active ? styles.filterTextOn : styles.filterTextOff]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: { marginVertical: 16 },
  filterScroll: { paddingHorizontal: 24, gap: 8, alignItems: 'center' },
  filterButton: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: Radius.full },
  filterActive: { backgroundColor: Colors.primary, ...Shadows.sm },
  filterInactive: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  filterText: { fontSize: 13, fontWeight: '700' },
  filterTextOn: { color: Colors.white },
  filterTextOff: { color: Colors.foreground },
});
