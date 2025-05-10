import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TrackHeatMap from "../track-heatmap";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { TAILWIND_COLORS } from "@/constants/Icons";
import { buildDataForDots, getTailwindColor } from "@/lib";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useHabit } from "@/providers/newhabit-providers";
import { trpc } from "@/utils/trpc";
import { habitData } from "@repo/api/types";

export default function FocusHabit() {
  const { setModalVisible, setFocusHabitId, focusHabitId } = useHabit();
  if (!focusHabitId) return;
  const { data, isLoading, error } = trpc.habits.getHabitWithId.useQuery({
    id: focusHabitId,
  });
  if (isLoading) {
    return <ActivityIndicator size={40} color={"black"} />;
  }

  if (!isLoading && !data) {
    return (
      <View>
        <Text>{error?.message}</Text>
      </View>
    );
  }
  const { habit, habitOptions, isCompletedToday } = data as habitData;

  const scrollRef = useRef<ScrollView>(null);
  const heatmapData = buildDataForDots({
    habitId: habit.id,
    habitOptions: habitOptions,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, []);
  const theme = useColorScheme();
  const handleHabitFocus = useCallback(() => {
    setModalVisible(false);
    setFocusHabitId(null);
  }, []);

  const utils = trpc.useUtils();
  const createOptionApi = trpc.habits.createHabitOption.useMutation();
  const handleCreateOption = useCallback(async () => {
    setLoading(true);
    try {
      await createOptionApi.mutateAsync({
        habitId: habit.id,
        isCompletedToday,
      });
      utils.habits.getAllhabits.invalidate();
      utils.habits.getHabitWithId.invalidate();
    } catch (error: any) {
      Alert.alert("On creating options", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View
      style={[
        styles().card,
        { backgroundColor: theme === "dark" ? "#1f2937" : "#fff" },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles().infoRow}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles().iconCircle,
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
          <View style={styles().textCol}>
            <Text
              style={[
                styles().titleText,
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
        </View>
        <TouchableOpacity onPress={handleHabitFocus}>
          <Ionicons name="close-outline" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <TrackHeatMap data={heatmapData} color={habit.color} />
      </ScrollView>
      <View style={{ flexDirection: "column", gap: 16 }}>
        <View style={styles().actionContainer}>
          <TouchableOpacity
            onPress={handleCreateOption}
            activeOpacity={0.9}
            style={styles(getTailwindColor(habit.color, 500)).action}
          >
            <Text style={styles().textWhite}>
              {isCompletedToday ? "Uncomplete" : "Complete"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(getTailwindColor(habit.color, 300)).reminder}
          >
            <Text>{habit.reminder ?? "Daily"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(getTailwindColor(habit.color, 300)).streak}
          >
            <Text>{habit.maxStraks}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <TouchableOpacity>
            <Ionicons name="calendar-clear-outline" size={25} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={25} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="trash-outline" color={"red"} size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = (color?: string) =>
  StyleSheet.create({
    card: {
      padding: 12,
      borderRadius: 8,
      shadowColor: "#6b7280",
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
      flexDirection: "column",
      height: 260,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
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
    actionContainer: {
      gap: 4,
      flexDirection: "row",
    },
    action: {
      flex: 1,
      paddingVertical: 15,
      justifyContent: "center",
      paddingHorizontal: 20,
      borderRadius: 8,
      backgroundColor: color,
    },
    reminder: {
      borderRadius: 5,
      justifyContent: "center",
      width: 80,
      backgroundColor: color,
      alignItems: "center",
    },
    streak: {
      width: 48,
      backgroundColor: color,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    textWhite: { color: "white", fontSize: 16 },
    calender: {
      display: "flex",
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      justifyContent: "center",
      backgroundColor: "#047857",
      paddingHorizontal: 10,
    },

    edit: {
      display: "flex",
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 2,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#047857",
      paddingHorizontal: 10,
    },
  });
