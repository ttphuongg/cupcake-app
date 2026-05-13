import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface SearchSuggestionsProps {
  suggestions: string[];
  handleSearch: (query: string) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, handleSearch }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
  suggestionsContainer: { backgroundColor: Colors.white },
  suggestionItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 12,
  },
  suggestionText: { fontSize: 15, color: Colors.foreground },
  noResultContainer: { paddingVertical: 40, alignItems: 'center' },
  noResultText: { color: Colors.mutedForeground, fontSize: 15 },
});
