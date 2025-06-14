import type { ColorScheme } from "@/hooks/useColorScheme";

export const isDarkColorScheme = (scheme: ColorScheme) => {
  return scheme === "dark";
};
