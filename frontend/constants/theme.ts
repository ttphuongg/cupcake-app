/**
 * constants/theme.ts — Design System tokens cho toàn bộ app
 * Tất cả màu sắc, spacing, radius, typography đều khai báo ở đây.
 * KHÔNG dùng hex/rgba hardcode trong component — luôn import từ file này.
 */

export const Colors = {
  // ── Brand Palette ──────────────────────────────────────────
  primary: '#E8A0BF',       // Hồng chủ đạo
  primaryDark: '#D4729A',   // Pressed / hover state
  secondary: '#BA90C6',     // Tím phụ
  accent: '#C0DBEA',        // Xanh nhạt accent

  // ── Primary với Opacity ─────────────────────────────────────
  primaryAlpha10: 'rgba(232,160,191,0.1)',
  primaryAlpha20: 'rgba(232,160,191,0.2)',
  primaryAlpha50: 'rgba(232,160,191,0.5)',

  // ── Neutrals ────────────────────────────────────────────────
  background: '#FDFAF9',
  card: '#FFFFFF',
  surfaceAlt: '#F3F4F6',    // Input nền nhạt, row background
  border: '#F0F0F0',
  borderLight: '#E5E7EB',
  inputBackground: '#F5F5F7',

  // ── Text ────────────────────────────────────────────────────
  foreground: '#1A1A2E',        // Text chính
  textSecondary: '#6B7280',     // Text phụ (label, caption)
  mutedForeground: '#9CA3AF',   // Text rất nhạt (placeholder)

  // ── Semantic ────────────────────────────────────────────────
  success: '#22C55E',
  successLight: 'rgba(34,197,94,0.15)',
  danger: '#EF4444',
  dangerLight: 'rgba(239,68,68,0.12)',
  warning: '#F59E0B',
  warningLight: 'rgba(245,158,11,0.12)',

  // ── Overlay ─────────────────────────────────────────────────
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',
  shadow: 'rgba(0,0,0,0.06)',
  shadowMd: 'rgba(0,0,0,0.12)',

  // ── Convenience aliases ──────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  text: '#1A1A2E',  // alias cho foreground
} as const;

/** Dùng khi cần pass vào LinearGradient */
export const Gradients = {
  primary: ['rgba(232,160,191,0.2)', 'rgba(186,144,198,0.1)', 'rgba(192,219,234,0.2)'] as const,
  card: ['rgba(232,160,191,0.05)', 'rgba(186,144,198,0.05)'] as const,
  hero: ['transparent', 'rgba(0,0,0,0.6)'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
} as const;

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  // Font weights (as const để TS nhận đúng type)
  bold: '700' as const,
  semibold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
} as const;

/** Shadow preset — dùng với style prop trực tiếp */
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadowMd,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;