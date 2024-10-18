import { View, ViewStyle, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  center?: "full" | "horizontal" | "vertical";
  lightColor?: string;
  darkColor?: string;
};

const WihView = ({ style, center, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  const cStyle = center ? centerStyle[center] : {}

  return <View style={[{ backgroundColor }, cStyle, style]} {...otherProps} />;
}

type CenterStyle = {
  full: ViewStyle;
  horizontal: ViewStyle;
  vertical: ViewStyle;
}

const centerStyle: CenterStyle = {
  full: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontal: {
    flex: 1,
    alignItems: "center",
  },
  vertical: {
    flex: 1,
    justifyContent: "center",
  }
}

export default WihView;
