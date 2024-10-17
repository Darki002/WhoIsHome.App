import { useColorScheme } from 'react-native';

import ThemedColors from '@/constants/ThemedColors';

export function useThemeColor(colorName: keyof typeof ThemedColors.light & keyof typeof ThemedColors.dark,
  props: { light?: string; dark?: string } = {}
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return ThemedColors[theme][colorName];
  }
}
