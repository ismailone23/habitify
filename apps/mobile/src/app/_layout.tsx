import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as TaskManager from "expo-task-manager";
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
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    console.log("✅ Received a notification in the background!", {
      data,
      error,
      executionInfo,
    });

    if (error) {
      console.error("❌ Background notification task error:", error);
      return;
    }
    return Promise.resolve(); // ✅ explicitly return a Promise
  }
);

void Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

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
