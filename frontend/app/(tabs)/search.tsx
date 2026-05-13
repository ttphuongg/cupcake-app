import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useSearchLogic } from '../../hooks/useSearchLogic';
import { SearchBar } from '../../components/Search/SearchBar';
import { SearchSuggestions } from '../../components/Search/SearchSuggestions';
import { SearchHistory } from '../../components/Search/SearchHistory';

export default function SearchScreen() {
  const {
    searchQuery, setSearchQuery,
    searchHistory,
    suggestions,
    trendingSearches,
    handleSearch,
    handleClearHistory,
    handleRemoveHistoryItem,
    router,
  } = useSearchLogic();

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content}>
        {searchQuery ? (
          <SearchSuggestions
            suggestions={suggestions}
            handleSearch={handleSearch}
          />
        ) : (
          <SearchHistory
            searchHistory={searchHistory}
            trendingSearches={trendingSearches}
            handleSearch={handleSearch}
            handleClearHistory={handleClearHistory}
            handleRemoveHistoryItem={handleRemoveHistoryItem}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1 },
});
