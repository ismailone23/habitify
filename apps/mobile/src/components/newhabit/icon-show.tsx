import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColor";

export default function IconShow({
  arr,
  icon,
  setHabitData,
  title,
}: {
  title: string;
  arr: string[];
  icon: string;
  setHabitData: React.Dispatch<
    React.SetStateAction<{
      icon: string;
      color: string;
    }>
  >;
}) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "column" }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: colors.foreground,
          fontFamily: "Roboto",
        }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {arr.map((iconName) => (
          <TouchableOpacity
            onPress={() => setHabitData((p) => ({ ...p, icon: iconName }))}
            activeOpacity={1}
            key={iconName}
            style={{
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: icon == iconName ? colors.border : "transparent",
            }}
          >
            <Ionicons
              name={iconName as any}
              color={icon == iconName ? colors.foreground : colors.placeholder}
              size={22}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
