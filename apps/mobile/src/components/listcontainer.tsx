import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useColors } from "@/hooks/useColor";
import { HabitDataType } from "@repo/api/types";
import { trpc } from "@/lib/trpc";
import { getColorGroup, getColorWithLevel } from "@/lib";
import dayjs from "@/utils/dayjs";
import DynamicLucideIcon, { IconName } from "./dynamic-icon";

export default function ListContainer({
  data,
  handlePresentModalPress,
}: {
  data: HabitDataType;
  handlePresentModalPress: (id: string) => void;
}) {
  const { habit, options } = data;
  const utils = trpc.useUtils();
  const createOptionApi = trpc.habit.optionCount.useMutation();
  const colors = useColors();

  const handleHabitSheet = useCallback(() => {
    handlePresentModalPress(habit.id);
  }, [habit.id, handlePresentModalPress]);

  const last5Days = Array.from({ length: 5 }, (_, i) =>
    dayjs()
      .utc()
      .subtract(4 - i, "day")
      .startOf("day")
      .toDate()
  );

  const [loading, setLoading] = useState(false);

  const handleUpdateHabit = useCallback(
    async (day: Date) => {
      setLoading(true);
      try {
        await createOptionApi.mutateAsync({
          hId: habit.id,
          date: day,
        });
        await utils.habit.getAllHabits.invalidate();
        await utils.habit.getHabit.invalidate({ id: habit.id });
      } catch (error: any) {
        Alert.alert("Something went wrong", error.message);
      } finally {
        setLoading(false);
      }
    },
    [createOptionApi, habit.id, utils.habit]
  );

  return (
    <Pressable
      onPress={handleHabitSheet}
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
      <View style={{ flexDirection: "row", columnGap: 5, maxWidth: 150 }}>
        {loading ? (
          <ActivityIndicator size={24} />
        ) : (
          <DynamicLucideIcon
            size={24}
            name={habit.icon as IconName}
            color={getColorGroup(habit.color)[5]}
          />
        )}
        <Text
          numberOfLines={1}
          style={{
            fontSize: 16,
            color: colors.foreground,
            fontFamily: "Roboto",
          }}
        >
          {habit.name}
        </Text>
      </View>

      <View style={{ flexDirection: "row", columnGap: 10 }}>
        {last5Days.map((day, i) => {
          const matched = options.find((opt) => {
            const date = new Date(opt.createdAt);
            return (
              date.getUTCFullYear() === day.getUTCFullYear() &&
              date.getUTCMonth() === day.getUTCMonth() &&
              date.getUTCDate() === day.getUTCDate()
            );
          });
          const count = matched?.count ?? 0;

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
                {dayjs(day).format("ddd")}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: getColorWithLevel(
                    habit.color,
                    count,
                    habit.frequency.targetCount
                  ),
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
}
