import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import { useColors } from "@/hooks/useColor";
import { useHabit } from "@/providers/newhabit-providers";
import { defaultSpacing } from "@/utils/theme";

import Switch from "../Switch";

export default function AdvanceOptions() {
  const [expanded, setExpanded] = useState(false);
  const colors = useColors();

  const { setAdvanceFieldData, advanceFieldData } = useHabit();

  const toggleReminder = useCallback(() => {
    setAdvanceFieldData((p) => ({
      ...p,
      reminderEnabled: !p.reminderEnabled,
    }));
  }, [setAdvanceFieldData]);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  return (
    <View style={{ flexDirection: "column", marginTop: 10 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}
      >
        <View style={{ height: 1, backgroundColor: colors.border, flex: 1 }} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleExpand}
          style={{ flexDirection: "row", columnGap: 2, alignItems: "center" }}
        >
          <Text
            style={{ color: colors.foreground, fontSize: 16, fontWeight: 500 }}
          >
            Advance Options
          </Text>
          <Ionicons
            name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
            color={colors.foreground}
            size={15}
          />
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: colors.border, flex: 1 }} />
      </View>
      {expanded && (
        <View
          style={{
            flexDirection: "column",
            marginTop: 16,
            rowGap: 10,
            width: "100%",
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                color: colors.foreground,
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Turn on Reminder
            </Text>
            <Switch
              bgColor={colors.secondary}
              onToggle={toggleReminder}
              value={advanceFieldData.reminderEnabled}
            />
          </Pressable>
          <View style={{ flexDirection: "column", flex: 1, rowGap: 4 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: colors.foreground,
              }}
            >
              Reminder
            </Text>
            <Link asChild href={"/workspace/reminder"}>
              <Pressable
                style={{
                  width: "100%",
                  height: defaultSpacing * 2.5,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 5,
                  paddingHorizontal: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: colors.foreground }}>
                  {advanceFieldData.reminderFrequency}
                  {advanceFieldData.reminderFrequency !== "None" && (
                    <Text style={{ color: colors.foreground }}>
                      ({advanceFieldData.reminderTime})
                    </Text>
                  )}
                </Text>
                <Ionicons
                  size={20}
                  name="chevron-forward"
                  color={colors.foreground}
                />
              </Pressable>
            </Link>
          </View>
          <View style={{ flexDirection: "column", flex: 1, rowGap: 4 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: colors.foreground,
              }}
            >
              Categories
            </Text>
            <Pressable
              style={{
                width: "100%",
                height: defaultSpacing * 2.5,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 5,
                paddingHorizontal: 8,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ color: colors.foreground }}>None</Text>
              <Ionicons
                size={20}
                color={colors.foreground}
                name="chevron-forward"
              />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
