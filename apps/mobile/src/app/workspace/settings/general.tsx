import { View } from "react-native";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/constants/theme";
import LabelSwitch from "@/components/general-label";

export default function General() {
  const colors = useColors();

  return (
    <View
      style={{
        flexDirection: "column",
        paddingHorizontal: defaultSpacing,
        rowGap: 10,
        backgroundColor: colors.background,
      }}
    >
      <LabelSwitch
        storageKey={STORAGE_KEYS.MONTH_LABEL_KEY}
        textLabel="Month Label"
      />
      <LabelSwitch
        storageKey={STORAGE_KEYS.DAY_LABEL_KEY}
        textLabel="Day Label"
      />
    </View>
  );
}
