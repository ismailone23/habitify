import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/constants/theme";

export default function SettingsNav() {
  const path = usePathname().split("/")[2].replace("-", " ");
  const colors = useColors();
  return (
    <SafeAreaView>
      <View
        style={{
          width: "100%",
          paddingHorizontal: defaultSpacing,
          paddingVertical: defaultSpacing,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              textTransform: "capitalize",
              color: colors.foreground,
            }}
          >
            {path}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
