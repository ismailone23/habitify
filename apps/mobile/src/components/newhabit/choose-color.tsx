import { View, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import { colors } from "@/constants/Icons";
import { useHabit } from "@/providers/newhabit-providers";

export default function ChooseColor() {
  const { selectedColor, setSelectedColor } = useHabit();

  return (
    <View style={styles().container}>
      <ThemedText>Color</ThemedText>
      <View style={styles().colorContainer}>
        {colors.map(({ hex, name }, i) => (
          <Pressable
            key={i}
            onPress={() => setSelectedColor(name)}
            style={styles(hex).color}
          >
            <TouchableOpacity
              style={[
                styles().btncontainer,
                selectedColor === name ? styles().visible : styles().hidden,
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = (color?: string) =>
  StyleSheet.create({
    container: {
      flexDirection: "column", // flex-col
    },
    colorContainer: {
      flexDirection: "row", // flex-row
      marginTop: 8, // mt-2 = 2 * 4 = 8px
      flexWrap: "wrap", // flex-wrap
      gap: 8, // gap-2 = 2 * 4 = 8px (spacing between items)
    },
    color: {
      width: 34, // w-10 = 10 * 4 = 40px
      height: 34, // h-10 = 10 * 4 = 40px
      justifyContent: "center", // items-center
      alignItems: "center", // justify-center
      borderRadius: 8, // rounded-md (approximately 8px)
      backgroundColor: color, // bg-${color}-500 (dynamic color)
    },
    btncontainer: {
      width: 12, // w-4 = 4 * 4 = 16px
      height: 12, // h-4 = 4 * 4 = 16px
      backgroundColor: "white", // bg-white
      borderRadius: 4, // rounded (4px)
    },
    darkMode: {
      backgroundColor: "#3F3F46", // dark:bg-zinc-700 (dark mode)
    },
    hidden: {
      display: "none", // hidden
    },
    visible: {
      display: "flex", // block (make visible)
    },
  });
