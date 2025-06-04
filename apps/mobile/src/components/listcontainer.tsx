import { Ionicons } from "@expo/vector-icons";
import type { habitData } from "@repo/api/types";
import { format, subDays } from "date-fns";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import { getTailwindColor } from "@/lib";
import { trpc } from "@/utils/trpc";

export default function ListContainer({
  data,
  handlePresentModalPress,
}: {
  data: habitData;
  handlePresentModalPress: (id: string) => void;
}) {
  const { habit, habitOptions } = data;
  const utils = trpc.useUtils();
  const createOptionApi = trpc.habits.createHabitOption.useMutation();
  const colors = useColors();
  const isDark = useIsDark();

  const handleHabitSheet = useCallback(() => {
    handlePresentModalPress(habit.id);
  }, [habit.id, handlePresentModalPress]);

  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = subDays(new Date(), 4 - i);
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
  });

  const [loading, setLoading] = useState(false);

  const handleUpdateHabit = useCallback(
    async (day: Date) => {
      setLoading(true);
      try {
        await createOptionApi.mutateAsync({
          habitId: habit.id,
          timestamp: day,
        });
        await utils.habits.getAllhabits.invalidate();
        await utils.habits.getHabitWithId.invalidate({ id: habit.id });
      } catch (error: any) {
        Alert.alert("Something went wrong", error.message);
      } finally {
        setLoading(false);
      }
    },
    [createOptionApi, habit.id, utils.habits]
  );

  return (
    <Pressable
      onLongPress={handleHabitSheet}
      style={{
        backgroundColor: colors.black,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 10,
        borderRadius: 10,
      }}
    >
      <View style={{ flexDirection: "row", columnGap: 5 }}>
        {loading ? (
          <ActivityIndicator size={24} />
        ) : (
          <Ionicons
            name={habit.icon as any}
            size={24}
            color={getTailwindColor(habit.color, 500)}
          />
        )}
        <Text
          style={{
            fontSize: 16,
            color: colors.foreground,
            fontFamily: "Roboto",
          }}
        >
          {habit.title}
        </Text>
      </View>

      <View style={{ flexDirection: "row", columnGap: 10 }}>
        {last5Days.map((day, i) => {
          const completed = habitOptions.some((opt) => {
            const date = new Date(opt.timestamp);

            const isSameUTCDate =
              date.getUTCFullYear() === day.getUTCFullYear() &&
              date.getUTCMonth() === day.getUTCMonth() &&
              date.getUTCDate() === day.getUTCDate();

            return isSameUTCDate;
          });

          return (
            <Pressable
              key={i}
              style={{ flexDirection: "column", alignItems: "center" }}
              onPress={() => handleUpdateHabit(day)}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.foreground,
                  fontFamily: "Roboto",
                }}
              >
                {format(day, "EEE")}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: completed
                    ? getTailwindColor(habit.color, 500)
                    : getTailwindColor(habit.color, isDark ? 900 : 100),
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
}
