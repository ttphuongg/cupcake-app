import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  onBack: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, handleSearch, onBack }) => {
  return (
    <View style={styles.header}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
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
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { padding: 4 },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FDF3F6', // Very light pink background
    borderRadius: Radius.full, paddingHorizontal: 12, height: 45,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: Colors.foreground, paddingVertical: 0 },
  clearButton: { padding: 4 },
});
