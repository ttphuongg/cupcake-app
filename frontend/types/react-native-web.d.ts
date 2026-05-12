/**
 * Augment React Native's TextStyle to include web-only CSS properties
 * that are used to suppress browser default input outlines.
 * The @ts-ignore comment per-usage is an alternative, but this is cleaner.
 */
import 'react-native';

declare module 'react-native' {
  interface TextStyle {
    /** Web-only: suppresses default browser outline on inputs */
    outlineStyle?: 'none' | 'solid' | 'dotted' | 'dashed';
    /** Web-only: suppresses default browser outline color */
    outlineColor?: string;
    /** Web-only */
    outlineWidth?: number;
    /** Web-only: cursor CSS property */
    cursor?: string;
    /** Web-only: user-select CSS property */
    userSelect?: 'none' | 'auto' | 'text' | 'all';
  }
  interface ViewStyle {
    outlineStyle?: 'none' | 'solid' | 'dotted' | 'dashed';
    outlineColor?: string;
    outlineWidth?: number;
    cursor?: string;
    userSelect?: 'none' | 'auto' | 'text' | 'all';
  }
}
