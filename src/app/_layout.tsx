import { Stack } from "expo-router";
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RootLayout() {
  const backgroundColor = useThemeColor("background", {});
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor } }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
