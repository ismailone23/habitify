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
import { HabitOptions, Habits } from "@repo/db/schema";
import { trpc } from "@/utils/trpc";

type habitData = {
  habit: Habits;
  habitOptions: HabitOptions[];
};

export default function HabitMap({ habit, habitOptions }: habitData) {
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
      await createOptionApi.mutateAsync({ habitId: habit.id });
      utils.habits.getAllhabits.invalidate();
    } catch (error: any) {
      Alert.alert("on creating options", error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  console.log(habitOptions);

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
            className={`w-14 h-14 justify-center items-center rounded-full border border-${habit.color}-300`}
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
