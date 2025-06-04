import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useColors } from "@/hooks/useColor";

export default function Loading() {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <ActivityIndicator color={colors.primary} size={30} />
    </View>
  );
}
