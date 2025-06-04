import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { activityIcons, iconsTray } from "@/constants/Icons";
import { useColors } from "@/hooks/useColor";
import { useHabit } from "@/providers/newhabit-providers";

import IconShow from "./icon-show";

export default function ChooseIcon({
  setHabitData,
  icon,
}: {
  icon: string;
  setHabitData: React.Dispatch<
    React.SetStateAction<{
      icon: string;
      color: string;
    }>
  >;
}) {
  const { isUpdating } = useHabit();
  const iconNames = Object.keys(Ionicons.glyphMap);
  const [expanded, setExpanded] = useState(isUpdating);

  const colors = useColors();
  const toggleIconCollapse = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  const activityIconsArr = iconNames.filter((icon) =>
    activityIcons.includes(icon)
  );
  const visibleIcons = expanded
    ? activityIconsArr
    : activityIconsArr.slice(0, 15);

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            rowGap: 8,
          }}
        >
          {expanded ? (
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: colors.foreground,
                fontFamily: "Roboto",
              }}
            >
              Activities
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: colors.foreground,
                fontFamily: "Roboto",
              }}
            >
              Icon
            </Text>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {visibleIcons.map((iconName) => (
              <TouchableOpacity
                onPress={() => setHabitData((p) => ({ ...p, icon: iconName }))}
                activeOpacity={1}
                key={iconName}
                style={{
                  width: 38,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor:
                    icon == iconName ? colors.border : "transparent",
                }}
              >
                <Ionicons
                  name={iconName as any}
                  color={
                    icon == iconName ? colors.foreground : colors.placeholder
                  }
                  size={22}
                />
              </TouchableOpacity>
            ))}
            {!expanded && (
              <Pressable
                onPress={toggleIconCollapse}
                style={{
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  backgroundColor: colors.border,
                }}
              >
                <Ionicons name="add" size={24} color={colors.foreground} />
              </Pressable>
            )}
          </View>
        </View>
        {expanded && (
          <View style={{ flexDirection: "column", rowGap: 8 }}>
            {iconsTray.map((exIcon, i) => (
              <IconShow
                key={i}
                title={exIcon.title}
                icon={icon}
                setHabitData={setHabitData}
                arr={iconNames.filter((name) => exIcon.icons.includes(name))}
              />
            ))}
            <TouchableOpacity
              onPress={toggleIconCollapse}
              style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                marginTop: 4,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.destructive,
              }}
            >
              <Ionicons
                size={22}
                name="remove-outline"
                color={colors.destructiveForeground}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
