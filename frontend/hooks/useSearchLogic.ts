import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useProductStore } from '../store/productStore';

export function useSearchLogic() {
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
        .map(p => p.name)
        .slice(0, 5);
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

  return {
    searchQuery, setSearchQuery,
    searchHistory,
    suggestions,
    trendingSearches,
    handleSearch,
    handleClearHistory,
    handleRemoveHistoryItem,
    router,
  };
}
