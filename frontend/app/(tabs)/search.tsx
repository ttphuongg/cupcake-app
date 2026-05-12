/**
 * app/(tabs)/search.tsx
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X, Clock, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useProductStore } from '../../store/productStore';

export default function SearchScreen() {
  const router = useRouter();
  const { products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const trendingSearches = ['Red Velvet', 'Chocolate', 'Matcha', 'Sinh nhật', 'Giảm giá', 'Bestseller'];

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const historyStr = await AsyncStorage.getItem('searchHistory');
      if (historyStr) {
        setSearchHistory(JSON.parse(historyStr).slice(0, 10));
      }
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const matches = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(p => p.name).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    const updatedHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(updatedHistory);
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save search history', e);
    }

    // Điều hướng về màn hình Home trong tabs với tham số search
    router.push({
      pathname: '/',
      params: { search: query }
    });
  };

  const handleClearHistory = async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem('searchHistory');
    } catch (e) {
      console.error('Failed to clear search history', e);
    }
  };

  const handleRemoveHistoryItem = async (item: string) => {
    const updated = searchHistory.filter(h => h !== item);
    setSearchHistory(updated);
    try {
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove history item', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.foreground} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Search size={20} color={Colors.mutedForeground} style={styles.searchIcon} />
            <TextInput
              placeholder="Tìm kiếm bánh cupcake..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              autoFocus
              style={styles.input}
              placeholderTextColor={Colors.mutedForeground}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <X size={20} color={Colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {searchQuery ? (
          <View style={styles.suggestionsContainer}>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSearch(suggestion)}
                  style={styles.suggestionItem}
                >
                  <Search size={18} color={Colors.mutedForeground} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>Không tìm thấy sản phẩm</Text>
              </View>
            )}
          </View>
        ) : (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF3F6', // Very light pink background
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.foreground,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  suggestionsContainer: {
    backgroundColor: Colors.white,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  suggestionText: {
    fontSize: 15,
    color: Colors.foreground,
  },
  noResultContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultText: {
    color: Colors.mutedForeground,
    fontSize: 15,
  },
  historySection: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.foreground,
  },
  clearAllText: {
    color: Colors.danger,
    fontSize: 13,
  },
  historyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  historyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    gap: 6,
  },
  historyTagText: {
    fontSize: 13,
    color: Colors.foreground,
  },
  trendingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  trendingTag: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#F3E5E8', // Light pinkish border
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  trendingTagText: {
    color: Colors.primaryDark,
    fontSize: 13,
    fontWeight: '500',
  },
});
