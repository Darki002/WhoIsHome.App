import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const WihView = ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });
  console.log(backgroundColor);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export default WihView;
