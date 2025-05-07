import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import React from "react";

export default function WorkspaceLayout() {
  return (
    <ThemedView>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="workspace" />
      </Stack>
    </ThemedView>
  );
}
