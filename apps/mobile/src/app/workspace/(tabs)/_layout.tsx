import React from "react";
import { Tabs } from "expo-router";
import { useColors } from "@/hooks/useColor";
import WorkspaceNavbar from "@/components/workspace-navbar";
import { Feather } from "@expo/vector-icons";
const tabsDetails = [
  {
    icon: "grid",
    route: "index",
  },
  {
    icon: "list",
    route: "list-view",
  },
  {
    icon: "plus",
    route: "new-habit",
  },
];
export default function TabsLayout() {
  const colors = useColors();
  return (
    <Tabs
      screenOptions={{
        header: () => <WorkspaceNavbar />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveBackgroundColor: colors.background,
      }}
    >
      {tabsDetails.map(({ icon, route }, i) => (
        <Tabs.Screen
          key={i}
          name={route}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => (
              <Feather name={icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
