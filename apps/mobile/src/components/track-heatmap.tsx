import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { TAILWIND_COLORS } from "@/constants/Colors";
import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import { getTailwindColor } from "@/lib";
import { useLabelSettings } from "@/providers/LabelProviders";

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

  const today = dayjs().format("YYYY-MM-DD");

  const isDark = useIsDark();
  const scrollRef = useRef<ScrollView>(null);
  const colors = useColors();
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, []);

  const getColorLevel = useCallback(
    (count: number) => {
      if (count === 0)
        return {
          backgroundColor: getTailwindColor(color, 100),
          opacity: isDark ? 0.2 : 0.8,
        };
      if (count < 2) return { backgroundColor: getTailwindColor(color, 300) };
      if (count < 5) return { backgroundColor: getTailwindColor(color, 500) };
      return { backgroundColor: getTailwindColor(color, 700) };
    },
    [color, isDark]
  );

  const isToday = useCallback(
    (wday: string): boolean => {
      return wday === today;
    },
    [today]
  );

  const { showMonthLabel, showDayLabel } = useLabelSettings();

  return (
    <View style={{ flexDirection: "row", columnGap: 2 }}>
      {showDayLabel && (
        <View
          style={{
            flexDirection: "column",
            marginTop: showMonthLabel ? 15 : 0,
            justifyContent: "space-between",
          }}
        >
          {Array.from(["M", "T", "S"]).map((dayName, i) => (
            <Text
              key={i}
              style={{
                color: colors.foreground,
                fontSize: 10,
                paddingRight: 2,
              }}
            >
              {dayName}
            </Text>
          ))}
        </View>
      )}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ flexDirection: "column" }}>
          {showMonthLabel && (
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              {weeks.map((week, i) => {
                const firstDay = dayjs(week[0].date);
                const showLabel =
                  i === 0 ||
                  firstDay.month() !== dayjs(weeks[i - 1][0].date).month();

                return (
                  <View style={{ width: 10, alignItems: "center" }} key={i}>
                    {showLabel && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: isDark ? "#fff" : "#000",
                          transform: [{ rotate: "-0deg" }],
                          width: 20,
                          textAlign: "center",
                        }}
                      >
                        {firstDay.format("MMM")}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
            }}
          >
            {weeks.map((week, i) => (
              <View
                style={{
                  flexDirection: "column",
                  marginRight: 2,
                }}
                key={i}
              >
                {week.map((wday, j) => (
                  <View
                    style={{
                      flexDirection: "column",
                      marginBottom: 2,
                    }}
                    key={j}
                  >
                    <View
                      style={[
                        {
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                        },
                        getColorLevel(wday.count),
                        isToday(wday.date) && styles.todayCell,
                      ]}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  todayCell: {
    borderWidth: 1,
    borderColor: TAILWIND_COLORS.neutral[300],
  },
});
