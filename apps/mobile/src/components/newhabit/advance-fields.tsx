import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function AdvanceField({ title }: { title: string }) {
  return (
    <View className="flex flex-col flex-1 gap-y-1">
      <Text className="text-lg">{title}</Text>
      <TouchableOpacity className="w-full rounded-md px-4 py-3 border border-neutral-200 flex flex-row items-center justify-between">
        <Text className="text-lg">None</Text>
        <Ionicons size={18} name="chevron-forward-outline" />
      </TouchableOpacity>
    </View>
  );
}
