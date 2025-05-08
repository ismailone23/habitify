import { format } from "date-fns";
import { View } from "react-native";
import React from "react";

interface cellData {
  date: string;
  count: number;
}
export default function TrackHeatMap({
  data,
  color,
}: {
  color: string;
  data: cellData[];
}) {
  const weeks: cellData[][] = [];

  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  const today = format(new Date(), "yyyy-MM-dd");
  const getColorLevel = (count: number) => {
    if (count === 0) return `bg-${color}-100`;
    if (count < 2) return `bg-${color}-300`;
    if (count < 5) return `bg-${color}-500`;
    return `bg-${color}-700`;
  };
  function isToday(wday: string): boolean {
    return wday === today;
  }

  return (
    <View className="flex-row mt-2">
      {weeks.map((week, i) => (
        <View className="flex-col mr-[2px]" key={i}>
          {week.map((wday, j) => (
            <View className="flex-col mb-[2px]" key={j}>
              <View
                className={`w-2 h-2 ${getColorLevel(wday.count)} ${isToday(wday.date) ? `border border-zinc-500` : ""}`}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
