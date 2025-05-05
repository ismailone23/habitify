import { View, Text, TouchableHighlight } from "react-native";
import React from "react";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();
  const handleRoute = () => {
    router.push("/workspace");
  };
  return (
    <SafeAreaView>
      <ThemedView className="w-full p-5 h-full items-center justify-center">
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl text-white py-5 font-bold">
            Habitify - your personal habit tracker assistat
          </Text>
          <ThemedText className="text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
            pariatur minus delectus sit, earum, modi vel consectetur cupiditate
            nemo sunt vitae accusantium quam! Id recusandae modi et eaque sequi
            asperiores inventore?
          </ThemedText>
        </View>
        <TouchableHighlight
          onPress={handleRoute}
          className="my-5 w-full py-4 rounded bg-sky-500"
        >
          <Text className="text-white text-center text-lg font-medium">
            Continue With Habitify
          </Text>
        </TouchableHighlight>
      </ThemedView>
      <StatusBar hidden={false} />
    </SafeAreaView>
  );
}
