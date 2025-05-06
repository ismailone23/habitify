"use client";

import React from "react";
import { View } from "react-native";

type Props = {
  data: number[]; // array of 7 * N days (e.g. 365 days)
};

const getColorLevel = (count: number) => {
  if (count === 0) return "bg-gray-200 dark:bg-gray-700";
  if (count < 5) return "bg-green-100";
  if (count < 10) return "bg-green-300";
  if (count < 20) return "bg-green-500";
  return "bg-green-700";
};

const TrackHeatMap: React.FC<Props> = ({ data }) => {
  const weeks = Math.ceil(data.length / 7);
  const grid: number[][] = Array.from({ length: weeks }, (_, i) =>
    data.slice(i * 7, i * 7 + 7)
  );

  return (
    <View className="flex-row">
      {grid.map((week, i) => (
        <View key={i} className="flex-col mr-1">
          {week.map((count, j) => (
            <View
              key={j}
              className={`w-4 h-4 mb-1 rounded-sm ${getColorLevel(count)}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default TrackHeatMap;
