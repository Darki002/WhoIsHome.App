import { useThemeColor } from "@/hooks/useThemeColor";
import { IonIcon, MateriaIcon, MaterialCommunityIcon } from '@/components/WihIcon';
import { Tabs } from "expo-router";
import React from "react";

const TabIconProps = {
  size: 28,
  style: {
    marginBottom: -3
  }
}

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
            <IonIcon name={focused ? 'home' : 'home-outline'} color={color} {...TabIconProps} />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, focused }) => (
            <MateriaIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} {...TabIconProps} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcon name={focused ? 'account-circle' : 'account-circle-outline'} color={color} {...TabIconProps} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabsLayout;
