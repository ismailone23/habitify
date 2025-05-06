import { View, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/src/components/ThemedView";
import HabitContainer from "@/src/components/habit-container";

export default function Workspace() {
  return (
    <ThemedView>
      <View className="px-4 h-full">
        <Text className="text-lg">Home</Text>
        <HabitContainer />
      </View>
    </ThemedView>
  );
}
