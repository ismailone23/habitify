import { View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import HabitContainer from "@/components/habit-container";

export default function Workspace() {
  return (
    <ThemedView>
      <View className="px-4 h-full">
        <HabitContainer />
      </View>
    </ThemedView>
  );
}
