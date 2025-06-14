import { defaultBorderRadius } from "@/constants/theme";
import { useColors } from "@/hooks/useColor";
import { LucideIcon } from "lucide-react-native";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

export default function LucideIconButton({
  Icon,
  onPress,
  selected,
  style,
  iconSize = 32,
}: {
  Icon: LucideIcon;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
}) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          backgroundColor: selected ? colors.border : "transparent",
          borderColor: colors.border,
          borderRadius: defaultBorderRadius,
          width: 40,
          height: 40,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Icon color={colors.foreground} size={iconSize} />
    </TouchableOpacity>
  );
}
