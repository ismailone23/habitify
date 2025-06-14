import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useCallback } from "react";
import { Alert, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

// import ThemeSwitch from "@/components/theme-switch";
import { useColors } from "@/hooks/useColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/providers/auth-provider";
import { defaultSpacing } from "@/constants/theme";
import ThemeSwitch from "@/components/theme-switch";

export default function Settings() {
  const colors = useColors();

  const { colorScheme, toggleScheme } = useColorScheme();
  const { signOut } = useAuth();
  const handleSignout = useCallback(async () => {
    try {
      await signOut();
      router.push("/signin");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }, [signOut]);

  return (
    <View
      style={{
        paddingHorizontal: defaultSpacing,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <View style={{ rowGap: 10, flexDirection: "column", width: "100%" }}>
        <Text
          style={{
            fontWeight: "600",
            marginLeft: 4,
            color: colors.foreground,
          }}
        >
          App
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            rowGap: 8,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.border,
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <Link href="/workspace/settings/general" asChild>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="cog-outline"
                color={colors.foreground}
                size={20}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  marginLeft: 10,
                  color: colors.foreground,
                }}
              >
                General
              </Text>
            </Pressable>
          </Link>
          <View
            style={{
              width: "100%",
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            }}
          />
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Ionicons
                name="color-palette-outline"
                color={colors.foreground}
                size={20}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  marginLeft: 10,
                  color: colors.foreground,
                }}
              >
                Theme
              </Text>
            </View>
            <ThemeSwitch
              onToggle={() => toggleScheme(colorScheme)}
              value={colorScheme === "dark"}
            />
          </Pressable>
          <View
            style={{
              width: "100%",
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
            }}
          />
          <Link href="/workspace/settings/archive-list" asChild>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="archive-outline"
                color={colors.foreground}
                size={20}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  marginLeft: 10,
                  color: colors.foreground,
                }}
              >
                Archive List
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <Pressable
        onPress={handleSignout}
        style={{
          backgroundColor: colors.destructive,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: defaultSpacing * 3,
          marginBottom: defaultSpacing,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: colors.destructiveForeground,
            fontSize: 16,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Signout
        </Text>
      </Pressable>
    </View>
  );
}
