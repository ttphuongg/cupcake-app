import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  // App hiện tại chỉ hỗ trợ light mode
  const colorFromProps = props.light;
  if (colorFromProps) {
    return colorFromProps;
  }
  return Colors[colorName] as string;
}
