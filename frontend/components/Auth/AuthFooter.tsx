import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
      <View style={styles.row}>
        <Text style={styles.footerBaseText}>{baseText}</Text>
        <Link href={href as any} asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLinkText}> {linkText}</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  footer: { marginTop: 24, alignItems: 'center', paddingBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerBaseText: { fontSize: 15, color: Colors.mutedForeground },
  footerLinkText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
});
