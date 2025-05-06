import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { habitsData, habitStreakData } from "./habit-container";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import TrackHeatMap from "./track-heatmap";

interface Habit {
  habit: (typeof habitsData)[0];
  habitStreak: typeof habitStreakData;
}
export default function HabitMap({ habit, habitStreak }: Habit) {
  const days = 365;
  const dummyData = Array.from({ length: days }, () =>
    Math.floor(Math.random() * 25)
  );
  return (
    <View className="flex gap-y-2 p-2 rounded flex-col bg-white">
      <View className="flex flex-row gap-x-2">
        <TouchableOpacity
          activeOpacity={1}
          className={`w-12 h-12 flex items-center justify-center rounded bg-${habit.color}-200`}
        >
          <Ionicons size={24} name={habit.icon as any} />
        </TouchableOpacity>
        <View className="flex-1 flex-col">
          <Text className="text-lg line-clamp-1 text-ellipsis font-medium">
            {habit.title}
          </Text>
          <Text className="line-clamp-1 text-ellipsis">
            {habit.description}
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TrackHeatMap data={dummyData} />
      </ScrollView>
    </View>
  );
}
