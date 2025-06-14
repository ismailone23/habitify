import React from "react";
import { Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import { useLabelSettings } from "@/providers/LabelProviders";
import { defaultSpacing } from "@/constants/theme";
import Switch from "./Switch";

export default function LabelSwitch({
  storageKey,
  textLabel,
}: {
  storageKey: string;
  textLabel: string;
}) {
  const colors = useColors();
  const isDark = useIsDark();

  const { showMonthLabel, setShowMonthLabel, showDayLabel, setShowDayLabel } =
    useLabelSettings();

  const value =
    storageKey === STORAGE_KEYS.MONTH_LABEL_KEY ? showMonthLabel : showDayLabel;

  const toggle = () => {
    const newValue = !value;
    if (storageKey === STORAGE_KEYS.MONTH_LABEL_KEY) {
      void setShowMonthLabel(newValue);
    } else {
      void setShowDayLabel(newValue);
    }
  };

  return (
    <Pressable
      onPress={toggle}
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: isDark ? colors.black : colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: defaultSpacing,
        borderRadius: 5,
      }}
    >
      <Text
        style={{ color: colors.foreground, fontSize: 14, fontWeight: "500" }}
      >
        {textLabel}
      </Text>
      <Switch value={value} onToggle={toggle} />
    </Pressable>
  );
}
