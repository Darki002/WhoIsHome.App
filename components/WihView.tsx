import {View, ViewStyle, type ViewProps} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  center?: "full" | "horizontal" | "vertical";
  flex?: "horizontal" | "vertical";
  lightColor?: string;
  darkColor?: string;
};

const WihView = ({ style, center, flex, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  const cStyle = center ? centerStyle[center] : {}
  const fStyle = flex ? flexStyle[flex] : {}

  return <View style={[{ backgroundColor }, cStyle, fStyle, style]} {...otherProps} />;
}

type CenterStyle = {
  full: ViewStyle;
  horizontal: ViewStyle;
  vertical: ViewStyle;
}

type FlexStyle = {
  horizontal: ViewStyle;
  vertical: ViewStyle;
}

const flexStyle: FlexStyle = {
  horizontal: {
    flex: 1,
    flexDirection: "row"
  },
  vertical: {
    flex: 1,
    flexDirection: "column"
  }
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
