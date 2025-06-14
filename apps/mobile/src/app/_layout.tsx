import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import * as Notifications from "expo-notifications";
import { NotificationProvider } from "@/providers/notification-provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ColorSchemeProvider, { useIsDark } from "@/hooks/useColorScheme";
import { useColors } from "@/hooks/useColor";
import TRPcProvider from "@/providers/trpc-provider";
import AuthProvider from "@/providers/auth-provider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import IconsProvider from "@/providers/icons-provider";
import { LabelSettingsProvider } from "@/providers/LabelProviders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: false,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: false,
  }),

  handleError: (error) => {
    console.error("Notification handler error:", error);
    return Promise.resolve();
  },
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/RobotoFont.ttf"),
  });

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
          <IconsProvider>
            <TRPcProvider>
              <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </AuthProvider>
            </TRPcProvider>
          </IconsProvider>
        </BottomSheetModalProvider>
      </LabelSettingsProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
