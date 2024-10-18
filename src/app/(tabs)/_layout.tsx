import { useThemeColor } from "@/hooks/useThemeColor";
import { WihTabIcon, AwesomeTabIcon } from '@/components/navigation/TabIcon';
import { Tabs } from "expo-router";

export default function RootLayout() {
  const tint = useThemeColor("tint");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <WihTabIcon name={focused ? 'home' : 'home-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AwesomeTabIcon name={focused ? 'user-circle' : 'user-circle-o'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
