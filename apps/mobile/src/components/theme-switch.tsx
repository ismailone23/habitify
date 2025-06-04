import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColor";

interface ThemeSwitchProps {
  value: boolean;
  onToggle: () => void;
}

export default function ThemeSwitch({ value, onToggle }: ThemeSwitchProps) {
  const knobTranslateX = useSharedValue(value ? 30 : 0);
  const colors = useColors();

  React.useEffect(() => {
    knobTranslateX.value = withTiming(value ? 30 : 0, { duration: 200 });
  }, [knobTranslateX, value]);

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobTranslateX.value }],
  }));

  return (
    <Pressable onPress={onToggle}>
      <View
        style={{
          width: 60,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.secondary,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 2,
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <View
          style={{
            zIndex: 2,
            marginLeft: 4,
          }}
        >
          <Feather name="sun" size={18} color={value ? "#ccc" : "#FFA500"} />
        </View>
        <View
          style={{
            zIndex: 2,
            marginRight: 4,
          }}
        >
          <Feather
            name="moon"
            size={18}
            color={value ? "#8AB4F8" : colors.foreground}
          />
        </View>
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 25,
              height: 25,
              borderRadius: 20,
              backgroundColor: "#fff",
              top: 2,
              left: 3,
              zIndex: 1,
            },
            animatedKnobStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}
