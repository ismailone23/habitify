import { Ionicons } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

export default function IconShow({
  arr,
  icon,
  setIcon,
  title,
}: {
  title: string;
  arr: string[];
  icon: string;
  setIcon: Dispatch<SetStateAction<string>>;
}) {
  return (
    <View style={styles().flexColumnContainer}>
      <ThemedText>{title}</ThemedText>
      <View style={styles().flexRowContainer}>
        {arr.map((iconName) => (
          <TouchableOpacity
            onPress={() => setIcon(iconName)}
            activeOpacity={1}
            key={iconName}
            style={styles(icon, iconName).iconContainer}
          >
            <Ionicons name={iconName as any} size={22} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const styles = (icon?: string, iconName?: string) =>
  StyleSheet.create({
    // Container with column layout and gap between items
    flexColumnContainer: {
      flexDirection: "column", // flex-col
      gap: 8, // gap-2 = 2 * 4 = 8px
    },

    // Container with row layout, wrapping elements, and gap between them
    flexRowContainer: {
      flexDirection: "row", // flex-row
      flexWrap: "wrap", // flex-wrap
      gap: 8, // gap-2 = 2 * 4 = 8px
    },

    // Icon container with dynamic background based on icon matching
    iconContainer: {
      width: 40, // w-12 = 12 * 4 = 48px
      height: 40, // h-12 = 12 * 4 = 48px
      borderWidth: 1, // border
      borderColor: "#E5E7EB", // border-slate-200
      borderRadius: 8, // rounded-md (approximately 8px)
      justifyContent: "center", // items-center
      alignItems: "center", // justify-center
      backgroundColor: icon === iconName ? "#E5E7EB" : "transparent", // bg-slate-200 conditional
    },
  });
