import React from "react";
import { Tabs } from "expo-router";
import Navbar from "@/src/components/navbar";

export default function TabsRoute() {
  return (
    <Tabs screenOptions={{ header: () => <Navbar /> }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
