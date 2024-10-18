import { useThemeColor } from "@/hooks/useThemeColor";
import WihTabIcon from '@/components/navigation/WihTabIcon';
import { Tabs } from "expo-router";
import WihView from "@/components/WihView";

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
            <WihTabIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
