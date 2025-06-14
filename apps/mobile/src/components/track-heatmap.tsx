import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { getColorWithLevel } from "@/lib";
import { useLabelSettings } from "@/providers/LabelProviders";
import dayjs from "@/utils/dayjs";
import { useIsDark } from "@/hooks/useColorScheme";
import { useColors } from "@/hooks/useColor";
interface cellData {
  date: string;
  count: number;
}

export default function TrackHeatMap({
  data,
  color,
  targetCount,
}: {
  targetCount: number;
  color: string;
  data: cellData[];
}) {
  const weeks: cellData[][] = [];

  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  const isDark = useIsDark();
  const colors = useColors();

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 0);
  }, []);
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
                {week.map((wday, j) => {
                  return (
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
                            backgroundColor: getColorWithLevel(
                              color,
                              wday.count,
                              targetCount
                            ),
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
