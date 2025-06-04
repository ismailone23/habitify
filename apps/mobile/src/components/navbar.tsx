import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/utils/theme";

export default function Navbar() {
  const colors = useColors();
  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: defaultSpacing,
          paddingTop: defaultSpacing,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: colors.foreground,
            fontFamily: "Roboto",
          }}
        >
          Habi
          <Text style={{ color: colors.primary }}>tly</Text>
        </Text>
        <Link href="/workspace/new-habit-modal">
          <Ionicons
            name="add-circle-outline"
            size={28}
            color={colors.primary}
          />
        </Link>
      </View>
    </SafeAreaView>
  );
}
