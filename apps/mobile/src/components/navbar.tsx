import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Navbar() {
  return (
    <ThemedView>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={[styles.text, styles.darkText]}>
            Habit
            <Text style={styles.lightText}>ify</Text>
          </Text>
          <Link href="/workspace/modal">
            <Ionicons name="add-circle-outline" size={30} color={"#0ea5e9"} />
          </Link>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "500",
  },
  lightText: {
    color: "#0284c7",
  },
  darkText: {
    color: "#111827",
  },
  darkMode: {
    color: "#ffffff",
  },
});
