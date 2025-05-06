import NewHabitProvider from "@/src/components/providers/newhabit-providers";
import { ThemedView } from "@/src/components/ThemedView";
import { Stack } from "expo-router";
import React from "react";

export default function WorkspaceLayout() {
  return (
    <ThemedView>
      <NewHabitProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="workspace" />
        </Stack>
      </NewHabitProvider>
    </ThemedView>
  );
}
