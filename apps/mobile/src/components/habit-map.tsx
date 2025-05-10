import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import TrackHeatMap from "./track-heatmap";
import { buildDataForDots, getTailwindColor } from "../lib";
import { trpc } from "@/utils/trpc";
import { habitData } from "@repo/api/types";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { TAILWIND_COLORS } from "@/constants/Icons";
import { useHabit } from "@/providers/newhabit-providers";

export default function HabitMap({
  habit,
  habitOptions,
  isCompletedToday,
}: habitData) {
  const scrollRef = useRef<ScrollView>(null);
  const heatmapData = buildDataForDots({ habitId: habit.id, habitOptions });
  const utils = trpc.useUtils();
  const createOptionApi = trpc.habits.createHabitOption.useMutation();
  const [loading, setLoading] = useState(false);
  const { setModalVisible, modalVisible, setFocusHabitId } = useHabit();
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, []);

  const handleCreateOption = useCallback(async () => {
    setLoading(true);
    try {
      await createOptionApi.mutateAsync({
        habitId: habit.id,
        isCompletedToday,
      });
      utils.habits.getAllhabits.invalidate();
    } catch (error: any) {
      Alert.alert("On creating options", error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  const theme = useColorScheme();

  const handleHabitFocus = useCallback(() => {
    setModalVisible((prev) => !prev);
    setFocusHabitId(habit.id);
  }, []);

  return (
    <Pressable
      onPress={handleHabitFocus}
      style={[
        styles.card,
        { backgroundColor: theme === "dark" ? "#1f2937" : "#fff" },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.infoRow}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.iconCircle,
              {
                backgroundColor: getTailwindColor(habit.color, 500),
                opacity: 0.8,
              },
            ]}
          >
            <Ionicons
              size={30}
              name={habit.icon as any}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
          <View style={styles.textCol}>
            <Text
              style={[
                styles.titleText,
                { color: theme === "dark" ? "#d1d5db" : "#000" },
              ]}
              numberOfLines={1}
            >
              {habit.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: theme === "dark" ? "#d1d5db" : "#000" }}
            >
              {habit.description}
            </Text>
          </View>
          <Pressable
            disabled={loading}
            onPress={handleCreateOption}
            style={[
              styles.checkButton,
              {
                backgroundColor: isCompletedToday
                  ? getTailwindColor(habit.color, 500)
                  : getTailwindColor(habit.color, 100),
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={TAILWIND_COLORS.sky[500]} size={24} />
            ) : (
              <Ionicons
                name="checkmark-outline"
                color={theme === "light" ? "black" : "white"}
                size={24}
              />
            )}
          </Pressable>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <TrackHeatMap data={heatmapData} color={habit.color} />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    shadowColor: "#6b7280",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textCol: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
  },
  checkButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
