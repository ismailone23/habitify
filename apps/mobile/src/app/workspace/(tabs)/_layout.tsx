import React from "react";
import { Tabs } from "expo-router";

export default function TabsRoute() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
}
