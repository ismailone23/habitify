// components/GraySwitch.tsx
import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColor";

interface GraySwitchProps {
  value: boolean;
  onToggle: () => void;
  bgColor?: string;
}

export default function Switch({ value, onToggle, bgColor }: GraySwitchProps) {
  const knobPosition = useSharedValue(value ? 26 : 2);
  const colors = useColors();
  React.useEffect(() => {
    knobPosition.value = withTiming(value ? 26 : 2, { duration: 200 });
  }, [knobPosition, value]);

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobPosition.value }],
  }));

  return (
    <Pressable onPress={onToggle}>
      <View
        style={{
          width: 55,
          height: 30,
          borderRadius: 15,
          justifyContent: "center",
          backgroundColor: value
            ? colors.primary
            : (bgColor ?? colors.background),
        }}
      >
        <Animated.View
          style={[
            {
              width: 25,
              height: 25,
              borderRadius: 13,
            },
            animatedKnobStyle,
            { backgroundColor: value ? "#fff" : colors.primary },
          ]}
        />
      </View>
    </Pressable>
  );
}
