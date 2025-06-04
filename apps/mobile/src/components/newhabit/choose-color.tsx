import React from "react";
import { Pressable, Text, View } from "react-native";

import { colors as allColors } from "@/constants/Colors";
import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/utils/theme";

export default function ChooseColor({
  setHabitData,
  colorName,
}: {
  colorName: string;
  setHabitData: React.Dispatch<
    React.SetStateAction<{
      icon: string;
      color: string;
    }>
  >;
}) {
  const spacing = defaultSpacing / 3;
  const colorsHook = useColors();

  return (
    <View style={{ flexDirection: "column" }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 8,
          color: colorsHook.foreground,
        }}
      >
        Color
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing,
        }}
      >
        {allColors.map(({ hex, name }, i) => {
          const isSelected = colorName === name;
          return (
            <Pressable
              key={i}
              onPress={() => setHabitData((prev) => ({ ...prev, color: name }))}
              style={{
                width: 38,
                height: 38,
                backgroundColor: hex,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSelected && (
                <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: colorsHook.background,
                    borderRadius: 7,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
