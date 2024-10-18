import { useThemeColor } from "@/hooks/useThemeColor";
import { IonTabIcon, AwesomeTabIcon } from '@/components/navigation/TabIcon';
import { Tabs } from "expo-router";

const TabsLayout = () => {
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
            <IonTabIcon name={focused ? 'home' : 'home-outline'} color={color} />
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

export default TabsLayout;
