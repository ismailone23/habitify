import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

import { useIsDark } from "@/hooks/useColorScheme";

export default function WorkspaceLayout() {
  const isDark = useIsDark();

  return (
    <View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="workspace" />
        <Stack.Screen
          name="new-habit-modal"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
      <StatusBar style={isDark ? "dark" : "dark"} />
    </View>
  );
}
