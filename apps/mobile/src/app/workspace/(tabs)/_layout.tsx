import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import Navbar from "@/components/navbar";
import { useColors } from "@/hooks/useColor";

const tabsDetails = [
  {
    icon: "apps-outline",
    route: "index",
  },
  {
    icon: "list-outline",
    route: "list-view",
  },
  {
    icon: "settings-outline",
    route: "settings",
  },
];

export default function TabsRoute() {
  const colors = useColors();
  return (
    <Tabs
      screenOptions={{
        header: () => <Navbar />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: colors.foreground,
        headerPressOpacity: 1,
        tabBarActiveBackgroundColor: "transparent",
      }}
    >
      {tabsDetails.map(({ icon, route }, i) => (
        <Tabs.Screen
          key={i}
          name={route}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon as any} size={size} color={color} />
            ),
            tabBarActiveTintColor: colors.primary,
          }}
        />
      ))}
    </Tabs>
  );
}
