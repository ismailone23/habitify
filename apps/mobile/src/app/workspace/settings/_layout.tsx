import SettingsNav from "@/components/settings-nav";
import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
  return <Stack screenOptions={{ header: () => <SettingsNav /> }} />;
}
