import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ReactNode } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { isDarkColorScheme } from "@/utils";

export type ColorScheme = "light" | "dark";

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleScheme: (scheme: ColorScheme) => Promise<void>;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | null>(null);

export default function ColorSchemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const systemColorScheme = useSystemColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadColorScheme = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.COLOR_KEY);
      if (stored === "light" || stored === "dark") {
        setColorSchemeState(stored);
      } else {
        const fallback = systemColorScheme === "dark" ? "dark" : "light";
        setColorSchemeState(fallback);
        await AsyncStorage.setItem(STORAGE_KEYS.COLOR_KEY, fallback);
      }
      setLoaded(true);
    };
    void loadColorScheme();
  }, [systemColorScheme]);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    await AsyncStorage.setItem(STORAGE_KEYS.COLOR_KEY, scheme);
    setColorSchemeState(scheme);
  }, []);

  const toggleScheme = useCallback(
    async (scheme: ColorScheme) => {
      const check = scheme === "light" ? "dark" : "light";
      void setColorScheme(check);
      await AsyncStorage.setItem(STORAGE_KEYS.COLOR_KEY, check);
    },
    [setColorScheme]
  );

  const contextValue = useMemo(
    () => ({ colorScheme, setColorScheme, toggleScheme }),
    [colorScheme, setColorScheme, toggleScheme]
  );

  if (!loaded) return null;

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error("useColorScheme must be used inside ColorSchemeProvider");
  }
  return context;
};

export const useIsDark = () => {
  const colorScheme = useColorScheme();
  return useMemo(
    () => isDarkColorScheme(colorScheme.colorScheme),
    [colorScheme]
  );
};
