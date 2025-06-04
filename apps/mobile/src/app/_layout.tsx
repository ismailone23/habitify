import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useColors } from "@/hooks/useColor";
import ColorSchemeProvider, { useIsDark } from "@/hooks/useColorScheme";
import AuthProvider from "@/providers/AuthProvider";
import { LabelSettingsProvider } from "@/providers/LabelProviders";
import NewHabitProvider from "@/providers/newhabit-providers";
import { NotificationProvider } from "@/providers/notification-provider";
import TRPcProvider from "@/providers/TRPcProvider";

Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Roboto: require("../../assets/fonts/RobotoFont.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <NotificationProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ColorSchemeProvider>
          <InnerRootLayout />
        </ColorSchemeProvider>
      </GestureHandlerRootView>
    </NotificationProvider>
  );
}

function InnerRootLayout() {
  const colors = useColors();
  const isDark = useIsDark();
  return (
    <ThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          border: colors.border,
          card: colors.background,
          notification: colors.background,
          primary: colors.primary,
          text: colors.foreground,
        },
      }}
    >
      <LabelSettingsProvider>
        <BottomSheetModalProvider>
          <TRPcProvider>
            <AuthProvider>
              <NewHabitProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </NewHabitProvider>
            </AuthProvider>
          </TRPcProvider>
        </BottomSheetModalProvider>
      </LabelSettingsProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
