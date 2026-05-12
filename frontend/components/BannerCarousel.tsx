import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Link } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  colors: [string, string, string] | [string, string];
}

interface BannerCarouselProps {
  banners: Banner[];
}

export const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = selectedIndex === 0 ? 6000 : 4000;
    const timer = setInterval(() => {
      const nextIndex = (selectedIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: nextIndex * (width - 48), animated: true });
      setSelectedIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [selectedIndex, banners]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (width - 48));
    setSelectedIndex(index);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        snapToInterval={width - 48}
        decelerationRate="fast"
      >
        {banners.map((banner, index) => (
          <Animated.View key={banner.id} style={[styles.slide, { opacity: fadeAnim }]}>
            <Link href={banner.link as Parameters<typeof Link>[0]['href']} asChild>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient
                  colors={banner.colors}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.card}
                >
                  <View style={styles.cardContent}>
                    {index === 0 && (
                      <View style={styles.iconContainer}>
                        <Sparkles color={Colors.primary} size={32} />
                      </View>
                    )}
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{banner.title}</Text>
                      <Text style={styles.subtitle}>{banner.subtitle}</Text>
                      {index === 0 && (
                        <View style={styles.button}>
                          <Text style={styles.buttonText}>Bắt đầu →</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === selectedIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  slide: {
    width: width - 48,
    marginRight: 8,
  },
  card: {
    minHeight: 160,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  button: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 32,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: 'rgba(150,150,150,0.3)',
  },
});
