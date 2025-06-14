import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColor";

import { HabitDataType } from "@repo/api/types";

import { buildDataForDots, getColorGroup } from "@/lib";
import { trpc } from "@/lib/trpc";
import { defaultSpacing } from "@/constants/theme";
import TrackHeatMap from "./track-heatmap";
import DynamicLucideIcon, { IconName } from "./dynamic-icon";
import dayjs from "@/utils/dayjs";

import Svg, { Circle } from "react-native-svg";

interface habitMapProps extends HabitDataType {
  handlePresentModalPress: (id: string) => void;
}

export default function HabitMap({
  habit,
  options,
  handlePresentModalPress,
}: habitMapProps) {
  const heatmapData = buildDataForDots({ habitId: habit.id, options });
  const utils = trpc.useUtils();
  const optionCountApi = trpc.habit.optionCount.useMutation();
  const [loading, setLoading] = useState(false);
  const colors = useColors();

  const handleCreateOption = useCallback(async () => {
    setLoading(true);
    try {
      await optionCountApi.mutateAsync({
        date: dayjs().startOf("day").toDate(),
        hId: habit.id,
      });
      await utils.habit.getAllHabits.invalidate();
      // await utils.habits.getHabitWithId.invalidate({ id: habit.id });
    } catch (error: any) {
      console.log(error);

      Alert.alert("On creating options", error.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHabitSheet = useCallback(() => {
    handlePresentModalPress(habit.id);
  }, [habit.id, handlePresentModalPress]);

  return (
    <Pressable
      onPress={handleHabitSheet}
      style={{
        flexDirection: "column",
        backgroundColor: colors.black,
        padding: defaultSpacing,
        borderRadius: 10,
        rowGap: 6,
      }}
    >
      <View style={{ flexDirection: "row", columnGap: 5 }}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            backgroundColor: getColorGroup(habit.color)[1],
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <DynamicLucideIcon
            name={habit.icon as IconName}
            color={habit.color}
            size={20}
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
            {habit.name}
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
        <TouchableOpacity
          disabled={loading}
          onPress={handleCreateOption}
          style={{
            backgroundColor: colors.black,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator
              color={getColorGroup(habit.color)[3]}
              size={40}
            />
          ) : (
            <CircularProgress
              backgroundColor={colors.background}
              progressColor={getColorGroup(habit.color)[3]}
              targetCount={habit.frequency.targetCount}
              textColor={colors.foreground}
              currentCount={
                options.find((opt) => opt.habitId === habit.id)?.count ?? 0
              }
            />
          )}
        </TouchableOpacity>
      </View>
      <TrackHeatMap
        targetCount={habit.frequency.targetCount}
        data={heatmapData}
        color={habit.color}
      />
    </Pressable>
  );
}

type Props = {
  currentCount: number;
  targetCount: number;
  size?: number; // full diameter (not radius)
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  textColor?: string;
  fontSize?: number;
};

const CircularProgress: React.FC<Props> = ({
  currentCount,
  targetCount,
  size = 40,
  strokeWidth = 4,
  backgroundColor = "#e0e0e0",
  progressColor = "#4caf50",
  textColor = "#333",
  fontSize = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(currentCount / targetCount, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: "center", justifyContent: "center" },
        ]}
        pointerEvents="none"
      >
        <Text style={{ color: textColor, fontSize, fontWeight: "600" }}>
          {currentCount} / {targetCount}
        </Text>
      </View>
    </View>
  );
};
