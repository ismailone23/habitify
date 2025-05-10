import { format } from "date-fns";
import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { getTailwindColor } from "@/lib";
import { TAILWIND_COLORS } from "@/constants/Icons";

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
    if (count === 0)
      return { backgroundColor: getTailwindColor(color, 100), opacity: 0.8 };
    if (count < 2) return { backgroundColor: getTailwindColor(color, 300) };
    if (count < 5) return { backgroundColor: getTailwindColor(color, 500) };
    return { backgroundColor: getTailwindColor(color, 700) };
  };

  function isToday(wday: string): boolean {
    return wday === today;
  }

  return (
    <View style={styles.container}>
      {weeks.map((week, i) => (
        <View style={styles.weekContainer} key={i}>
          {week.map((wday, j) => (
            <View style={styles.dayContainer} key={j}>
              <View
                style={[
                  styles.cell,
                  getColorLevel(wday.count),
                  isToday(wday.date) && styles.todayCell,
                ]}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 12,
  },
  weekContainer: {
    flexDirection: "column",
    marginRight: 2,
  },
  dayContainer: {
    flexDirection: "column",
    marginBottom: 2,
  },
  cell: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: TAILWIND_COLORS.neutral[500],
  },
});
