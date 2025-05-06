import { TouchableOpacity, View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AdvanceField from "./advance-fields";

export default function AdvanceOptions() {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  return (
    <View className="my-5 flex flex-col">
      <View className="flex items-center gap-x-2 flex-row">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleExpand}
          className="flex flex-row gap-x-1 items-center"
        >
          <Text className="text-slate-700 text-lg">Advance (coming soon)</Text>
          <Ionicons
            name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
            color={"gray"}
            size={18}
          />
        </TouchableOpacity>
        <View className="flex-1 h-[1px] bg-gray-200" />
      </View>
      {expanded && (
        <View className="flex flex-col gap-2 w-full">
          <View className="flex flex-row flex-1 w-full gap-x-5 justify-between">
            <AdvanceField title="Streak Goal" />
            <AdvanceField title="Reminder" />
          </View>
          <AdvanceField title="Categories" />
        </View>
      )}
    </View>
  );
}
