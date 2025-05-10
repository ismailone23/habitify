import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function AdvanceField({ title }: { title: string }) {
  return (
    <View style={styles.flexColumn}>
      <Text style={styles.textLg}>{title}</Text>
      <TouchableOpacity style={styles.container}>
        <Text style={styles.textLg}>None</Text>
        <Ionicons size={18} name="chevron-forward-outline" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  flexColumn: {
    flexDirection: "column", // flex flex-col
    flex: 1, // flex-1
    gap: 4, // gap-y-1 (0.25rem = 4px)
  },
  textLg: {
    fontSize: 16, // text-lg (1.125rem = 18px)
  },
  container: {
    width: "100%", // w-full
    borderRadius: 8, // rounded-md
    paddingHorizontal: 16, // px-4
    paddingVertical: 10, // py-3
    borderWidth: 1, // border
    borderColor: "#e5e7eb", // border-neutral-200 (Tailwind gray-200)
    flexDirection: "row", // flex flex-row
    alignItems: "center", // items-center
    justifyContent: "space-between", // justify-between
  },
});
