import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../hooks/useColorScheme.web";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "react-native-reanimated";
import AuthProvider from "../providers/AuthProvider";
import TRPcProvider from "../providers/TRPcProvider";
import NewHabitProvider from "@/providers/newhabit-providers";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <TRPcProvider>
        <AuthProvider>
          <NewHabitProvider>
            <BottomSheetModalProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack screenOptions={{ headerShown: false }} />
                <StatusBar style="dark" />
              </ThemeProvider>
            </BottomSheetModalProvider>
          </NewHabitProvider>
        </AuthProvider>
      </TRPcProvider>
    </GestureHandlerRootView>
  );
}
