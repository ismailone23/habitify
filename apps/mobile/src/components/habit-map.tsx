import { Ionicons } from "@expo/vector-icons";
import type { habitData } from "@repo/api/types";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/utils/theme";
import { trpc } from "@/utils/trpc";

import { buildDataForDots, getTailwindColor } from "../lib";
import TrackHeatMap from "./track-heatmap";

interface habitMapProps extends habitData {
  handlePresentModalPress: (id: string) => void;
}

export default function HabitMap({
  habit,
  habitOptions,
  isCompletedToday,
  handlePresentModalPress,
}: habitMapProps) {
  const heatmapData = buildDataForDots({ habitId: habit.id, habitOptions });
  const utils = trpc.useUtils();
  const createOptionApi = trpc.habits.createHabitOption.useMutation();
  const [loading, setLoading] = useState(false);
  const colors = useColors();

  const handleCreateOption = useCallback(async () => {
    setLoading(true);
    try {
      await createOptionApi.mutateAsync({
        habitId: habit.id,
        timestamp: new Date(),
      });
      await utils.habits.getAllhabits.invalidate();
      await utils.habits.getHabitWithId.invalidate({ id: habit.id });
    } catch (error: any) {
      Alert.alert("On creating options", error.message);
    } finally {
      setLoading(false);
    }
  }, [
    createOptionApi,
    habit.id,
    utils.habits.getAllhabits,
    utils.habits.getHabitWithId,
  ]);

  const handleHabitSheet = useCallback(() => {
    handlePresentModalPress(habit.id);
  }, [habit.id, handlePresentModalPress]);

  return (
    <Pressable
      onLongPress={handleHabitSheet}
      style={{
        flexDirection: "column",
        backgroundColor: colors.black,
        padding: defaultSpacing,
        marginBottom: defaultSpacing,
        borderRadius: 10,
        rowGap: 6,
      }}
    >
      <View style={{ flexDirection: "row", columnGap: 5 }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: getTailwindColor(habit.color, 500),
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Ionicons
            size={25}
            name={habit.icon as any}
            color={colors.destructiveForeground}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.foreground,
            }}
            numberOfLines={1}
          >
            {habit.title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: colors.foreground,
            }}
          >
            {habit.description}
          </Text>
        </View>
        <Pressable
          disabled={loading}
          onPress={handleCreateOption}
          style={{
            backgroundColor: isCompletedToday
              ? getTailwindColor(habit.color, 500)
              : "transparent",
            borderColor: getTailwindColor(habit.color, 500),
            borderWidth: 1,
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} size={24} />
          ) : (
            <Ionicons
              name="checkmark-outline"
              color={colors.foreground}
              size={24}
            />
          )}
        </Pressable>
      </View>
      <TrackHeatMap data={heatmapData} color={habit.color} />
    </Pressable>
  );
}
