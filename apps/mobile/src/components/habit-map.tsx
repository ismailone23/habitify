import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import TrackHeatMap from "./track-heatmap";
import { buildDataForDots } from "../lib";
import { trpc } from "@/utils/trpc";
import { habitData } from "@repo/api/types";

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
      Alert.alert("on creating options", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View className="flex p-3 rounded flex-col bg-white shadow-gray-500/50 shadow">
      <View className="flex flex-row items-center justify-between w-full">
        <View className="flex flex-row gap-x-2 flex-1">
          <TouchableOpacity
            activeOpacity={1}
            className={`w-14 h-14 flex items-center justify-center rounded bg-${habit.color}-200/40`}
          >
            <Ionicons size={30} name={habit.icon as any} />
          </TouchableOpacity>
          <View className="flex-1 flex-col">
            <Text className="text-lg line-clamp-1 text-ellipsis font-medium">
              {habit.title}
            </Text>
            <Text className="line-clamp-1 text-ellipsis">
              {habit.description}
            </Text>
          </View>
          <Pressable
            disabled={loading}
            onPress={handleCreateOption}
            className={`w-12 h-12 ${isCompletedToday ? `bg-${habit.color}-300` : `border border-${habit.color}-300`} justify-center items-center rounded-md`}
          >
            {loading ? (
              <ActivityIndicator size={24} />
            ) : (
              <Ionicons name="checkmark-outline" size={24} />
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
