import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, TrendingUp, X } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

interface SearchHistoryProps {
  searchHistory: string[];
  trendingSearches: string[];
  handleSearch: (query: string) => void;
  handleClearHistory: () => void;
  handleRemoveHistoryItem: (item: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchHistory,
  trendingSearches,
  handleSearch,
  handleClearHistory,
  handleRemoveHistoryItem,
}) => {
  return (
    <View style={styles.historySection}>
      {searchHistory.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Clock size={18} color={Colors.foreground} />
              <Text style={styles.sectionTitle}>Lịch sử tìm kiếm</Text>
            </View>
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearAllText}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyTags}>
            {searchHistory.map((item, index) => (
              <View key={index} style={styles.historyTag}>
                <TouchableOpacity onPress={() => handleSearch(item)}>
                  <Text style={styles.historyTagText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveHistoryItem(item)}>
                  <X size={14} color={Colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <TrendingUp size={18} color={Colors.foreground} />
          <Text style={styles.sectionTitle}>Xu hướng tìm kiếm</Text>
        </View>
        <View style={styles.trendingTags}>
          {trendingSearches.map((trend, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSearch(trend)}
              style={styles.trendingTag}
            >
              <Text style={styles.trendingTagText}>{trend}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historySection: { paddingVertical: 20 },
  section: { marginBottom: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  clearAllText: { color: Colors.danger, fontSize: 13 },
  historyTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  historyTag: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, gap: 6,
  },
  historyTagText: { fontSize: 13, color: Colors.foreground },
  trendingTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trendingTag: {
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#F3E5E8', // Light pinkish border
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: Radius.full,
  },
  trendingTagText: { color: Colors.primaryDark, fontSize: 13, fontWeight: '500' },
});
