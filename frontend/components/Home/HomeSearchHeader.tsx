import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Search, ArrowLeft } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';

interface HomeSearchHeaderProps {
  searchQuery: string;
  router: any;
}

export const HomeSearchHeader: React.FC<HomeSearchHeaderProps> = ({ searchQuery, router }) => {
  return (
    <View style={[styles.searchHeader, searchQuery ? styles.searchHeaderResults : null]}>
      {searchQuery ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.setParams({ search: '' })}>
            <ArrowLeft color={Colors.foreground} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/search')}
            style={[styles.searchBar, styles.searchBarResults, { flex: 1 }]}
          >
            <Search color={Colors.mutedForeground} size={20} style={styles.searchIcon} />
            <Text style={[styles.searchText, { color: Colors.foreground }]} numberOfLines={1}>
              {searchQuery}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/search')} style={styles.searchBar}>
          <Search color={Colors.mutedForeground} size={20} style={styles.searchIcon} />
          <Text style={styles.searchText}>Tìm kiếm bánh cupcake...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 48 : 12, paddingBottom: 40,
    elevation: 5, zIndex: 100,
  },
  searchHeaderResults: {
    backgroundColor: Colors.white, borderRadius: 0, paddingBottom: 16,
    elevation: 0, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  searchBar: {
    backgroundColor: Colors.white, borderRadius: Radius.xxl,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    ...Shadows.sm,
  },
  searchBarResults: { backgroundColor: '#FDF3F6', elevation: 0, shadowOpacity: 0 },
  searchIcon: { marginRight: 12 },
  searchText: { color: Colors.mutedForeground, fontSize: 14, fontWeight: '500', flex: 1 },
});
