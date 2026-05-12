/**
 * hooks/use-theme-color.ts
 * The Colors object is now a flat record (not nested light/dark).
 * This hook is kept for backward compatibility with Expo default components
 * (ThemedText, ThemedView, etc.) but returns the flat Colors value directly.
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  // App hiện tại chỉ hỗ trợ light mode — trả về màu từ props hoặc Colors flat
  const colorFromProps = props.light;
  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[colorName] as string;
}
