import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors, Typography } from '@/constants/theme';

interface AuthHeaderProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  color?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ icon, title, subtitle, color = Colors.primary }) => {
  return (
    <View style={styles.header}>
      <Animated.View entering={ZoomIn.delay(200).springify()} style={[styles.logoContainer, { backgroundColor: color, shadowColor: color }]}>
        <Feather name={icon} size={40} color="white" />
      </Animated.View>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subtitleText}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: {
    width: 80, height: 80, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10,
  },
  titleText: { 
    fontSize: 32, 
    fontWeight: Typography.bold, 
    color: Colors.foreground, 
    marginBottom: 8 
  },
  subtitleText: { 
    fontSize: 16, 
    fontWeight: Typography.regular, 
    color: Colors.mutedForeground 
  },
});
