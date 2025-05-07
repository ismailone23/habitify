import { ActivityIndicator, View, Text } from "react-native";
import React from "react";
import HabitMap from "./habit-map";
import { trpc } from "@/utils/trpc";
import { ScrollView } from "react-native-gesture-handler";

export default function HabitContainer() {
  const {
    data: habits,
    isLoading,
    isError,
  } = trpc.habits.getAllhabits.useQuery();
  if (isLoading) {
    return (
      <View className="flex-1 h-full justify-center items-center">
        <ActivityIndicator className="text-sky-700" size={25} />
      </View>
    );
  }
  if (!isLoading && isError) {
    <View>
      <Text className="text-center text-lg text-red-400">
        Someting went Wrong
      </Text>
    </View>;
  }

  return (
    <ScrollView>
      <View className="flex flex-col mt-3 gap-4 flex-1">
        {habits &&
          habits.length > 0 &&
          habits.map(({ habit, habitOptions }, i) => (
            <HabitMap
              key={i}
              habit={habit}
              habitOptions={habitOptions.filter(
                (hasd) => hasd.habitId === habit.id
              )}
            />
          ))}
      </View>
    </ScrollView>
  );
}
