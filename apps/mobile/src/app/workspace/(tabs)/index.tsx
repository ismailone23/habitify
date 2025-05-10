import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import HabitContainer from "@/components/habit-container";

export default function Workspace() {
  return (
    <ThemedView>
      <View style={styles.container}>
        <HabitContainer />
      </View>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: "100%",
  },
});
