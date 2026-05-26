import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';

interface AuthFooterProps {
  baseText: string;
  linkText: string;
  href: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ baseText, linkText, href }) => {
  return (
    <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
      <Text style={styles.footerBaseText}>
        {baseText}{' '}
        <Link href={href as any} asChild>
          <Text style={styles.footerLinkText}>{linkText}</Text>
        </Link>
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: { marginTop: 24, alignItems: 'center', paddingBottom: 20 },
  footerBaseText: { fontSize: 15, color: Colors.mutedForeground },
  footerLinkText: { color: Colors.primary, fontWeight: '700' },
});
