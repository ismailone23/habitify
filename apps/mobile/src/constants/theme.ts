import type { ColorScheme } from "@/hooks/useColorScheme";

export interface Colors {
  background: string;
  foreground: string;
  secondary: string;
  secondaryForeground: string;
  backdrop: string;
  primary: string;
  primaryForeground: string;
  border: string;
  placeholder: string;
  primaryUnderlayColor: string;
  secondaryUnderlayColor: string;
  destructive: string;
  destructiveForeground: string;
  black: string;
}

interface ColorRange {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

const zinc: ColorRange = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a1a1aa",
  500: "#737373",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#171717",
  950: "#09090b",
};

const gray: ColorRange = zinc;

export const colors: Record<ColorScheme, Colors> = {
  light: {
    background: gray[50],
    foreground: gray[900],
    secondary: gray[100],
    secondaryForeground: gray[500],
    border: gray[300],
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    backdrop: "rgba(178, 178, 187, 0.8)",
    placeholder: gray[700],
    primaryUnderlayColor: "#3b82f6",
    secondaryUnderlayColor: gray[200],
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    black: "#fff",
  },
  dark: {
    background: gray[900],
    foreground: gray[200],
    secondary: gray[800],
    secondaryForeground: gray[400],
    border: gray[700],
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    primaryUnderlayColor: "#2563eb",
    placeholder: gray[400],
    backdrop: "rgba(28, 28, 30, 0.8)",
    secondaryUnderlayColor: gray[700],
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    black: "#212121",
  },
};

export const defaultSpacing = 16;
export const defaultBorderRadius = 10;
