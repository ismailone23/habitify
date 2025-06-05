/* eslint-disable react-hooks/exhaustive-deps */
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

import HabitContainer from "@/components/habit-container";
import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import { useAuth } from "@/providers/AuthProvider";
import { useNotification } from "@/providers/notification-provider";
import { defaultSpacing } from "@/utils/theme";
import { trpc } from "@/utils/trpc";

export default function Workspace() {
  const colors = useColors();
  const isDark = useIsDark();

  const { error, expoPushToken } = useNotification();

  const { user } = useAuth();
  const updateUserApi = trpc.auth.updateUser.useMutation();

  useEffect(() => {
    const handlePushToken = async () => {
      if (user && !user.expoPushToken && expoPushToken) {
        console.log("token");
        return await updateUserApi.mutateAsync({ expoPushToken });
      }
      return;
    };
    console.log("already had token");
    void handlePushToken();
  }, []);

  if (error) {
    <View style={{ paddingHorizontal: 16 }}>
      <Text style={{ color: colors.destructive }}>{error.message}</Text>
    </View>;
  }

  return (
    <View
      style={{
        paddingHorizontal: defaultSpacing,
        height: "100%",
        backgroundColor: colors.background,
      }}
    >
      <HabitContainer />
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
}
