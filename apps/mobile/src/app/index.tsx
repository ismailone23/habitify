import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedText } from "../components/ThemedText";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { ThemedView } from "../components/ThemedView";

export default function LandingPage() {
  const router = useRouter();
  const handleRoute = () => {
    router.push("/workspace");
  };
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
      <TouchableOpacity
        onPress={handleRoute}
        activeOpacity={1}
        className="mb-10 w-full py-4 rounded bg-sky-500"
      >
        <Text className="text-white text-center text-lg font-medium">
          Continue With Habitify
        </Text>
      </TouchableOpacity>
      <StatusBar hidden={false} />
    </ThemedView>
  );
}
