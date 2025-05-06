import { View, Text, TouchableHighlight, TextInput } from "react-native";
import React from "react";
import { ThemedView } from "../ThemedView";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import ChooseIcon from "./choose-icon";
import ChooseColor from "./choose-color";
import AdvanceOptions from "./advance-options";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";

export default function NewHabit() {
  return (
    <ThemedView className="w-full overflow-hidden flex-1">
      <ScrollView>
        <View className="flex flex-col gap-y-3 px-5 flex-1">
          <View className="w-full gap-y-1">
            <ThemedText>Name</ThemedText>
            <TextInput
              className="border border-gray-300 dark:border-zinc-700 dark:text-gray-300 border-b-2 rounded-md px-2"
              placeholder=""
            />
          </View>
          <View className="w-full gap-y-1">
            <ThemedText>Description</ThemedText>
            <BottomSheetTextInput
              className="border border-gray-300 dark:border-zinc-700 dark:text-gray-300 border-b-2 rounded-md px-2"
              placeholder=""
            />
          </View>
          <ChooseColor />
          <ChooseIcon />
          <AdvanceOptions />
        </View>
      </ScrollView>
      <View className="bg-black/5 w-full py-5 px-5">
        <TouchableHighlight className="mb-20 bg-gray-700 w-full text-center py-3 rounded">
          <Text className="text-center text-white text-xl font-medium">
            Save
          </Text>
        </TouchableHighlight>
      </View>
      <StatusBar hidden />
    </ThemedView>
  );
}
