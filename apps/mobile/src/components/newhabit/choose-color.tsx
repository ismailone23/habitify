import { View, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";
import { colors } from "@/constants/Icons";
import { useHabit } from "@/providers/newhabit-providers";

export default function ChooseColor() {
  const { selectedColor, setSelectedColor } = useHabit();

  return (
    <View className="flex flex-col">
      <ThemedText>Color</ThemedText>
      <View className="flex mt-2 flex-wrap flex-row gap-2">
        {colors.map((color, i) => (
          <Pressable
            key={i}
            onPress={() => setSelectedColor(color)}
            className={`w-10 h-10 flex items-center justify-center rounded-md bg-${color}-500`}
          >
            <TouchableOpacity
              className={`w-4 h-4 ${selectedColor === color ? "block" : "hidden"} bg-white dark:bg-zinc-700 rounded`}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
