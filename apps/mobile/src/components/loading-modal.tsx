import { defaultBorderRadius } from "@/constants/theme";
import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

export default function LoadingModal({ loading }: { loading?: boolean }) {
  const colors = useColors();
  const isDark = useIsDark();

  return (
    <Modal visible={loading} transparent>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.backdrop,
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? colors.secondary : colors.background,
            borderRadius: defaultBorderRadius,
          }}
        >
          <ActivityIndicator color={colors.foreground} />
        </View>
      </View>
    </Modal>
  );
}
