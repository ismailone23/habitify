import { colors } from "@/utils/theme";

import { useColorScheme } from "./useColorScheme";

export const useColors = () => {
  const { colorScheme } = useColorScheme();
  return colors[colorScheme];
};
