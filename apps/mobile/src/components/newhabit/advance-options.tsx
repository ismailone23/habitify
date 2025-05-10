import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AdvanceField from "./advance-fields";

export default function AdvanceOptions() {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, [setExpanded]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.divider} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleExpand}
          style={styles.rowGap1}
        >
          <Text style={styles.text}>Advance (coming soon)</Text>
          <Ionicons
            name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
            color={"gray"}
            size={18}
          />
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
      {expanded && (
        <View style={styles.col}>
          <View style={[styles.row, styles.justifyBetween]}>
            <AdvanceField title="Streak Goal" />
            <AdvanceField title="Reminder" />
          </View>
          <AdvanceField title="Categories" />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row", // flex flex-row
    alignItems: "center", // items-center
    gap: 8, // gap-x-2 (1rem = 16px in default)
  },
  divider: {
    flex: 1,
    height: 1, // h-[1px]
    backgroundColor: "#e5e7eb", // bg-gray-200
  },
  text: {
    color: "#334155", // text-slate-700
    fontSize: 18, // text-lg (1.125rem = 18px)
  },
  fullWidth: {
    width: "100%", // w-full
  },
  flex1: {
    flex: 1, // flex-1
  },
  gap2: {
    gap: 8, // gap-2 (0.5rem = 8px)
  },
  justifyBetween: {
    justifyContent: "space-between", // justify-between
  },
  rowGap1: {
    flexDirection: "row", // flex-row
    gap: 4, // gap-x-1 (0.25rem = 4px)
    alignItems: "center", // items-center
  },
  col: {
    flexDirection: "column", // flex-row
    gap: 4, // gap-x-1 (0.25rem = 4px)
    alignItems: "center", // items-center
  },
});
