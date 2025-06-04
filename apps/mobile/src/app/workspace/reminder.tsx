import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { Platform, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import type { AdvanceFieldType } from "@/providers/newhabit-providers";
import { useHabit } from "@/providers/newhabit-providers";
import { defaultSpacing } from "@/utils/theme";

export default function Reminder() {
  const colors = useColors();
  const isDark = useIsDark();
  const { setAdvanceFieldData, advanceFieldData } = useHabit();
  const weeks = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];

  const handleFrequency = useCallback(
    (field: AdvanceFieldType["reminderFrequency"]) => {
      return setAdvanceFieldData((p) => ({ ...p, reminderFrequency: field }));
    },
    [setAdvanceFieldData]
  );

  const handleCustomWeek = useCallback(
    (day: string) => {
      setAdvanceFieldData((prev) => {
        if (prev.reminderDays.includes(day)) {
          return {
            ...prev,
            reminderDays: prev.reminderDays.filter(
              (prevday) => prevday !== day
            ),
          };
        } else {
          return {
            ...prev,
            reminderDays: [...prev.reminderDays, day],
          };
        }
      });
    },
    [setAdvanceFieldData]
  );

  const [show, setShow] = useState(false);

  const onChange = useCallback(
    (_event: any, selectedTime?: Date) => {
      setShow(Platform.OS === "ios");
      if (selectedTime) {
        setAdvanceFieldData((prev) => ({
          ...prev,
          reminderTime: dayjs(selectedTime).format("HH:mm"),
        }));
      }
    },
    [setAdvanceFieldData]
  );

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          paddingHorizontal: defaultSpacing,
          flexDirection: "column",
          rowGap: 10,
        }}
      >
        <View>
          <Pressable
            style={{
              alignItems: "center",
              flexDirection: "row",
              columnGap: 5,
            }}
            onPress={handleGoBack}
          >
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
            <Text
              style={{
                color: colors.foreground,
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              Reminder
            </Text>
          </Pressable>
        </View>
        <View style={{ rowGap: 10, flexDirection: "column" }}>
          <Text
            style={{ color: colors.foreground, fontSize: 15, fontWeight: 500 }}
          >
            Reminder Frequency
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {["None", "Daily", "Weekly", "Custom"].map((field, i) => (
              <Pressable
                onPress={() =>
                  handleFrequency(
                    field as AdvanceFieldType["reminderFrequency"]
                  )
                }
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor:
                    advanceFieldData.reminderFrequency === field
                      ? colors.primary
                      : colors.border,
                  paddingHorizontal: defaultSpacing,
                  paddingVertical: 8,
                  backgroundColor:
                    advanceFieldData.reminderFrequency === field
                      ? colors.primary
                      : "transparent",
                }}
                key={i}
              >
                <Text
                  style={{
                    color:
                      advanceFieldData.reminderFrequency === field
                        ? colors.primaryForeground
                        : colors.foreground,
                  }}
                >
                  {field}
                </Text>
              </Pressable>
            ))}
          </View>
          {advanceFieldData.reminderFrequency === "Custom" && (
            <View
              style={{
                flexDirection: "column",
                rowGap: 5,
                alignItems: "flex-start",
              }}
            >
              <Text style={{ color: colors.foreground, fontSize: 15 }}>
                Select Days
              </Text>
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                {weeks.map((item, index) => (
                  <Pressable
                    onPress={() => handleCustomWeek(item)}
                    key={index}
                    style={{
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: advanceFieldData.reminderDays.includes(item)
                        ? colors.primary
                        : colors.border,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: advanceFieldData.reminderDays.includes(
                        item
                      )
                        ? colors.primary
                        : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        color: advanceFieldData.reminderDays.includes(item)
                          ? colors.primaryForeground
                          : colors.foreground,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          {advanceFieldData.reminderFrequency !== "None" && (
            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
              <Text
                style={{
                  width: "100%",
                  textAlign: "left",
                  color: colors.foreground,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Time
              </Text>
              <View>
                <Pressable
                  onPress={() => setShow(true)}
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 8,
                    marginTop: 4,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: colors.primaryForeground }}>
                    {dayjs(advanceFieldData.reminderTime).format("HH:mm")}
                  </Text>
                </Pressable>

                {show && (
                  <RNDateTimePicker
                    value={new Date(advanceFieldData.reminderTime)}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "clock"}
                    onChange={onChange}
                    positiveButton={{ label: "OK", textColor: colors.primary }}
                    themeVariant={isDark ? "dark" : "light"}
                    negativeButton={{
                      label: "Cancel",
                      textColor: colors.foreground,
                    }}
                    style={{
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </View>
      <StatusBar hidden={false} style={isDark ? "light" : "dark"} />
    </SafeAreaView>
  );
}
