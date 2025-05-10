import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import IconShow from "./icon-show";
import { ThemedText } from "../ThemedText";
import { useHabit } from "@/providers/newhabit-providers";
import { activityIcons, iconsTray } from "@/constants/Icons";

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
      <View style={styles().container}>
        <View style={styles().containerWithGap}>
          {expanded ? (
            <ThemedText>Activities</ThemedText>
          ) : (
            <ThemedText>Icon</ThemedText>
          )}
          <View style={styles().rowContainer}>
            {visibleIcons.map((iconName) => (
              <TouchableOpacity
                onPress={() => setIcon(iconName)}
                activeOpacity={1}
                key={iconName}
                style={styles(icon, iconName).iconContainer}
              >
                <Ionicons name={iconName as any} size={22} />
              </TouchableOpacity>
            ))}
            {!expanded && (
              <Pressable
                onPress={toggleIconCollapse}
                style={styles().iconContainerDark}
              >
                <Text style={styles().text}>+</Text>
              </Pressable>
            )}
          </View>
        </View>
        {expanded && (
          <View style={styles().verticalContainer}>
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
              style={styles().redIconContainer}
            >
              <Ionicons size={22} name="remove-outline" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
const styles = (icon?: string, iconName?: string) =>
  StyleSheet.create({
    container: {
      flexDirection: "column", // flex flex-col
    },
    containerWithGap: {
      flexDirection: "column", // flex flex-col
      gap: 8, // gap-2 = 2 * 4 = 8px
    },
    rowContainer: {
      flexDirection: "row", // flex-row
      flexWrap: "wrap", // flex-wrap
      gap: 8, // gap-2 = 2 * 4 = 8px
    },
    iconContainer: {
      width: 40, // w-12 = 12 * 4 = 48px
      height: 40, // h-12 = 12 * 4 = 48px
      borderWidth: 1, // border
      borderColor: "#E5E7EB", // border-slate-200
      borderRadius: 8, // rounded-md (approximately 8px)
      justifyContent: "center", // items-center
      alignItems: "center", // justify-center
      backgroundColor: icon === iconName ? "#E5E7EB" : "transparent", // bg-slate-200 conditional
    },
    iconContainerDark: {
      width: 40, // w-12 = 12 * 4 = 48px
      height: 40, // h-12 = 12 * 4 = 48px
      borderRadius: 8, // rounded-md (approximately 8px)
      justifyContent: "center", // items-center
      alignItems: "center", // justify-center
      backgroundColor: "#4B5563", // dark:bg-slate-600
    },
    text: {
      fontSize: 18, // text-lg
      fontWeight: "700", // font-bold
    },
    verticalContainer: {
      flexDirection: "column", // flex flex-col
      marginTop: 8, // mt-2 = 2 * 4 = 8px
      gap: 8, // gap-y-2 = 2 * 4 = 8px
    },
    redIconContainer: {
      width: 36, // w-12 = 12 * 4 = 48px
      height: 36, // h-12 = 12 * 4 = 48px
      backgroundColor: "#F87171", // bg-red-300
      borderRadius: 6, // rounded-md
      justifyContent: "center", // items-center
      alignItems: "center", // justify-center
    },
  });
