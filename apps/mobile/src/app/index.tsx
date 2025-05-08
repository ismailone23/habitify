import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/providers/AuthProvider";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, signInAnonymously } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (isAuthenticated) {
        router.replace("/workspace");
      }
    };
    check();
  }, [isAuthenticated]);

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signInAnonymously();
      router.replace("/workspace");
    } catch (error: any) {
      return Alert.alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ThemedView className="w-full p-5 h-full items-center justify-center">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl dark:text-white py-5 font-bold">
          Habitify - Your Habit Assistat
        </Text>
        <ThemedText className="text-center">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
          pariatur minus delectus sit, earum, modi vel consectetur cupiditate
          nemo sunt vitae accusantium quam! Id recusandae modi et eaque sequi
          asperiores inventore?
        </ThemedText>
      </View>
      <View className="mb-10 w-full">
        <Pressable
          onPress={handleSignIn}
          disabled={isLoading}
          className={`"mb-10 w-full py-4 rounded ${isLoading ? "bg-sky-300" : "bg-sky-500"}`}
        >
          {isLoading ? (
            <ActivityIndicator className="text-white" />
          ) : (
            <Text className="text-white text-center text-lg font-medium">
              Continue With Habitify
            </Text>
          )}
        </Pressable>
      </View>
      <StatusBar hidden={false} />
    </ThemedView>
  );
}
