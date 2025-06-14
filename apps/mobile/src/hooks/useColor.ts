import { colors } from "@/constants/theme";
import { useColorScheme } from "./useColorScheme";

export const useColors = () => {
  const { colorScheme } = useColorScheme();
  return colors[colorScheme];
};
