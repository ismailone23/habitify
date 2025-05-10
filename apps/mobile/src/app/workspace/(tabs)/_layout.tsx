import React from "react";
import { Tabs } from "expo-router";
import Navbar from "@/components/navbar";
import MyTabBar from "@/components/tabbar";

export default function TabsRoute() {
  return (
    <Tabs
      screenOptions={{ header: () => <Navbar /> }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="list-view" />
    </Tabs>
  );
}
