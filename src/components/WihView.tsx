import { View, ViewStyle, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  center?: boolean;
  lightColor?: string;
  darkColor?: string;
};

const WihView = ({ style, center, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  const centerStyle: ViewStyle = center ? {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } : {}

  return <View style={[{ backgroundColor }, centerStyle, style]} {...otherProps} />;
}

export default WihView;
