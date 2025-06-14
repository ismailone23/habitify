import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColor";
import { useAuth } from "@/providers/auth-provider";

export default function Signin() {
  const router = useRouter();
  const { isAuthenticated, signInAnonymously } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const colors = useColors();

  useEffect(() => {
    const check = () => {
      if (isAuthenticated) {
        router.replace("/workspace");
      }
    };
    void check();
  }, [isAuthenticated, router]);

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signInAnonymously();
      router.replace("/workspace");
    } catch (error: any) {
      return Alert.alert("Something went wrong", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [router, signInAnonymously]);

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: colors.background,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            rowGap: 16,
          }}
        >
          <Text
            style={{ color: colors.foreground, fontWeight: 700, fontSize: 24 }}
          >
            Habitly - Habits Made Simple
          </Text>
          <Text
            style={{
              color: colors.foreground,
              fontWeight: 500,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Build the life you want, one habit at a time. Habitly helps you stay
            consistent, motivated, and on track—every single day. Because real
            change starts with what you do daily.
          </Text>
        </View>
        <Pressable
          onPress={handleSignIn}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: colors.primary,
            height: 48,
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color={colors.primaryForeground} />
          ) : (
            <Text
              style={{
                color: colors.primaryForeground,
                textAlign: "center",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              Continue With Habitly
            </Text>
          )}
        </Pressable>
        <StatusBar hidden={false} />
      </View>
    </SafeAreaView>
  );
}
