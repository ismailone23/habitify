import { Stack } from "expo-router";
import React from "react";

import SettingsNav from "@/components/settings-nav";

export default function SettingsLayout() {
  return <Stack screenOptions={{ header: () => <SettingsNav /> }} />;
}
