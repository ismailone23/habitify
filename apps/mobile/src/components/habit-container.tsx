import { View } from "react-native";
import React from "react";
import HabitMap from "./habit-map";

export const habitsData = [
  {
    id: "js1l09df-sdfkas12-189jskaf",
    title: "Wake up Early Morning",
    icon: "alarm-outline",
    mazStreak: 1,
    description: "wak skdf o lsj -sdf j k sa k l jsfo o amm laj",
    color: "sky",
    createddAt: new Date("2025-5-1"),
  },
  {
    id: "ki819-92js9f-a0d81",
    title: "Morning cycling & Evening",
    icon: "bicycle-outline",
    mazStreak: 2,
    description: "Wake Up and go For exercise with cycle also in the evening",
    color: "fuchsia",
    createddAt: new Date("2025-04-28"),
  },
];

export const habitStreakData = [
  {
    habitId: "js1l09df-sdfkas12-189jskaf",
    timestamp: new Date("2025-05-04"),
    streak: 1,
  },
  {
    habitId: "js1l09df-sdfkas12-189jskaf",
    timestamp: new Date("2025-05-02"),
    streak: 1,
  },
  {
    habitId: "js1l09df-sdfkas12-189jskaf",
    timestamp: new Date("2025-05-03"),
    streak: 1,
  },
  {
    habitId: "ki819-92js9f-a0d81",
    timestamp: new Date("2025-05-03"),
    streak: 1,
  },
  {
    habitId: "ki819-92js9f-a0d81",
    timestamp: new Date("2025-05-01"),
    streak: 1,
  },
];

export default function HabitContainer() {
  return (
    <View className="flex flex-col gap-4 flex-1">
      {habitsData.map((habit, i) => (
        <HabitMap
          key={i}
          habit={habit}
          habitStreak={habitStreakData.filter(
            (hasd) => hasd.habitId === habit.id
          )}
        />
      ))}
    </View>
  );
}
