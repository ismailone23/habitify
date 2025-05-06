import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";
import IconShow from "./icon-show";
import { activityIcons, iconsTray } from "@/src/constants/Icons";
import { useHabit } from "../providers/newhabit-providers";
import { ThemedText } from "../ThemedText";

export default function ChooseIcon() {
  const { icon, setIcon } = useHabit();
  const iconNames = Object.keys(Ionicons.glyphMap);
  const [expanded, setExpanded] = useState(false);

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
      <View className="flex flex-col">
        <View className="flex gap-2 flex-col">
          {expanded ? (
            <ThemedText>Activities</ThemedText>
          ) : (
            <ThemedText>Icon</ThemedText>
          )}
          <View className="flex-row flex-wrap gap-2">
            {visibleIcons.map((iconName) => (
              <TouchableOpacity
                onPress={() => setIcon(iconName)}
                activeOpacity={1}
                key={iconName}
                className={`w-12 h-12 border rounded-md border-slate-200 ${icon === iconName ? "bg-slate-200" : ""} items-center justify-center`}
              >
                <Ionicons name={iconName as any} size={22} />
              </TouchableOpacity>
            ))}
            {!expanded && (
              <Pressable
                onPress={toggleIconCollapse}
                className="w-12 h-12 rounded-md items-center justify-center bg-slate-200 dark:bg-slate-600"
              >
                <Text className="text-lg font-bold">+</Text>
              </Pressable>
            )}
          </View>
        </View>
        {expanded && (
          <View className="flex flex-col mt-2 gap-y-2">
            {iconsTray.map((exIcon, i) => (
              <IconShow
                key={i}
                title={exIcon.title}
                icon={icon}
                setIcon={setIcon}
                arr={iconNames.filter((name) => exIcon.icons.includes(name))}
              />
            ))}
            <TouchableOpacity
              onPress={toggleIconCollapse}
              className="w-12 mt-1 h-12 bg-red-300 flex items-center justify-center rounded-md  "
            >
              <Ionicons size={22} name="remove-outline" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
