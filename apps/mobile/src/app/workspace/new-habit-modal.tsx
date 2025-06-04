import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NewHabit from "@/components/newhabit/new-habit";
import { useColors } from "@/hooks/useColor";
import { useHabit } from "@/providers/newhabit-providers";

export default function Modal() {
  const colors = useColors();
  const { isUpdating, setIsUpdating, setToUpdateId } = useHabit();
  const handleGoback = useCallback(() => {
    setToUpdateId(null);
    setIsUpdating(false);
  }, [setIsUpdating, setToUpdateId]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 4,
          marginVertical: 8,
        }}
      >
        <Link href="/workspace" asChild>
          <Pressable onPress={handleGoback}>
            <Ionicons name="close" color={colors.foreground} size={26} />
          </Pressable>
        </Link>
        <Text
          style={{
            textAlign: "center",
            flex: 1,
            fontSize: 18,
            fontFamily: "Roboto",
            color: colors.foreground,
            fontWeight: 700,
          }}
        >
          {isUpdating ? "Update Habit" : "New Habit"}
        </Text>
      </View>
      <NewHabit />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
