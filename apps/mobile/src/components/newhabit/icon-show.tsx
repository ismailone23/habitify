import { Ionicons } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction } from "react";
import { View, TouchableOpacity } from "react-native";
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
    <View className="flex gap-2 flex-col">
      <ThemedText>{title}</ThemedText>
      <View className="flex-row flex-wrap gap-2">
        {arr.map((iconName) => (
          <TouchableOpacity
            onPress={() => setIcon(iconName)}
            activeOpacity={1}
            key={iconName}
            className={`w-12 h-12 border rounded-md border-slate-200 ${icon === iconName ? "bg-slate-200" : ""} items-center justify-center`}
          >
            <Ionicons name={iconName as any} size={22} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
