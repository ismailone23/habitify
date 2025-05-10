import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import TrackHeatMap from "./track-heatmap";
import { Ionicons } from "@expo/vector-icons";
import { HabitOptions, Habits } from "@repo/db/schema";
import { trpc } from "@/utils/trpc";
import { buildDataForDots } from "@/lib";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function FocusedHabit({
  habit,
  habitOptions,
  isCompletedToday,
}: {
  habit: Habits;
  habitOptions: HabitOptions[];
  isCompletedToday: boolean;
}) {
  const utils = trpc.useUtils();
  const createOptionApi = trpc.habits.createHabitOption.useMutation();

  const scrollRef = useRef<ScrollView>(null);
  const heatmapData = buildDataForDots({ habitId: habit.id, habitOptions });

  const [loading, setLoading] = useState(false);

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
        timestamp: new Date(),
      });
      utils.habits.getAllhabits.invalidate();
    } catch (error: any) {
      Alert.alert("on creating options", error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  const theme = useColorScheme();
  return (
    <View className="flex p-3 rounded flex-col bg-white dark:bg-neutral-800 shadow-gray-500/50 shadow">
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex flex-row gap-x-2 flex-1">
          <TouchableOpacity
            activeOpacity={1}
            className={`w-14 h-14 flex items-center justify-center rounded bg-${habit.color}-200/40`}
          >
            <Ionicons
              size={30}
              name={habit.icon as any}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
          <View className="flex-1 flex-col">
            <Text className="text-lg line-clamp-1 text-ellipsis font-medium dark:text-gray-300">
              {habit.title}
            </Text>
            <Text className="line-clamp-1 text-ellipsis dark:text-gray-300">
              {habit.description}
            </Text>
          </View>
          <Pressable
            disabled={loading}
            onPress={handleCreateOption}
            className={`w-12 h-12 ${isCompletedToday ? `bg-${habit.color}-300` : `bg-${habit.color}-50`} justify-center items-center rounded-md`}
          >
            {loading ? (
              <ActivityIndicator size={24} />
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
    </View>
  );
}
