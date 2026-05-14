import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { BounceIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useHomeLogic } from '../../hooks/useHomeLogic';
import { HomeSearchHeader } from '../../components/Home/HomeSearchHeader';
import { HomeFilterPills } from '../../components/Home/HomeFilterPills';
import { ProductGridItem } from '../../components/Home/ProductGridItem';
import { FloatingCartButton } from '../../components/Home/FloatingCartButton';
import { BannerCarousel } from '../../components/BannerCarousel';
import { CategoryGrid } from '../../components/CategoryGrid';
import { FlyingDot } from '../../components/FlyingDot';
import { BANNERS } from '../../constants/banners';

export default function HomeScreen() {
  const {
    router,
    searchQuery,
    displayProducts,
    categories,
    selectedCategory, setSelectedCategory,
    sortType, setSortType,
    isLoadingProducts,
    cartTotal,
    cartScale,
    flyingDots, setFlyingDots,
    cartTargetX, cartTargetY,
    getCartQty,
    handleAdd,
    handleQty,
  } = useHomeLogic();

  const animatedCart = { transform: [{ scale: cartScale }] };

  return (
    <SafeAreaView style={[styles.container, searchQuery ? styles.containerSearchResults : null]}>
      {/* thanh tìm kiếm */}
      <HomeSearchHeader searchQuery={searchQuery} router={router} />  

      <FlatList
        data={displayProducts} 
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.scrollContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {!searchQuery && (
              <Animated.View entering={BounceIn}>
                <View style={{ marginTop: 24 }}>
                  <BannerCarousel banners={BANNERS} />
                  <CategoryGrid
                    data={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />
                </View>
              </Animated.View>
            )}
            <HomeFilterPills sortType={sortType} setSortType={setSortType} />
          </>
        }
        renderItem={({ item: p, index: i }) => (
          <ProductGridItem
            product={p}
            index={i}
            qty={getCartQty(p.id ?? 0)}
            handleAdd={handleAdd}
            handleQty={handleQty}
          />
        )}
        ListFooterComponent={isLoadingProducts ? <View style={styles.loader}><ActivityIndicator size="small" color="#FF6B81" /></View> : null}
      />

      <FloatingCartButton cartTotal={cartTotal} animatedCart={animatedCart} />

      {flyingDots.map((dot) => (
        <FlyingDot
          key={dot.id}
          startX={dot.startX - 11}
          startY={dot.startY - 11}
          targetX={cartTargetX}
          targetY={cartTargetY}
          onComplete={() => setFlyingDots((p: any) => p.filter((d: any) => d.id !== dot.id))}
        />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  containerSearchResults: { backgroundColor: Colors.white },
  scrollContent: { paddingBottom: 100 },
  columnWrapper: { paddingHorizontal: 20, justifyContent: 'space-between' },
  loader: { paddingVertical: 24, alignItems: 'center' },
});
