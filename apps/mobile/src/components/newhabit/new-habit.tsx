import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { ThemedView } from "../ThemedView";
import { BottomSheetTextInput, useBottomSheet } from "@gorhom/bottom-sheet";
import ChooseIcon from "./choose-icon";
import ChooseColor from "./choose-color";
import AdvanceOptions from "./advance-options";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { useAuth } from "@/providers/AuthProvider";
import { useHabit } from "@/providers/newhabit-providers";
import { trpc } from "@/utils/trpc";

export default function NewHabit() {
  const { close } = useBottomSheet();
  const [basicData, setBasicData] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const { icon, selectedColor } = useHabit();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);
  const createHabitApi = trpc.habits.createHabit.useMutation();

  const handleCreateHabit = useCallback(async () => {
    const { description, title } = basicData;
    setLoading(true);
    try {
      await createHabitApi.mutateAsync({
        color: selectedColor,
        icon,
        title,
        description,
      });
      await utils.habits.getAllhabits.invalidate();
      close({ duration: 1 });
    } catch (error: any) {
      Alert.alert("Occured problem on creating habit", error.message);
    } finally {
      setLoading(false);
    }
  }, [basicData, createHabitApi, utils]);
  return (
    <ThemedView className="w-full overflow-hidden flex-1">
      <ScrollView>
        <View className="flex flex-col gap-y-3 px-5 flex-1">
          <View className="w-full gap-y-1">
            <ThemedText>Name</ThemedText>
            <TextInput
              value={basicData.title}
              onChangeText={(text) =>
                setBasicData((prev) => ({ ...prev, title: text }))
              }
              className="border border-gray-300 dark:border-zinc-700 dark:text-gray-300 border-b-2 rounded-md px-2"
              placeholder=""
            />
          </View>
          <View className="w-full gap-y-1">
            <ThemedText>Description</ThemedText>
            <BottomSheetTextInput
              value={basicData.description}
              onChangeText={(text) =>
                setBasicData((prev) => ({ ...prev, description: text }))
              }
              className="border border-gray-300 dark:border-zinc-700 dark:text-gray-300 border-b-2 rounded-md px-2"
            />
          </View>
          <ChooseColor />
          <ChooseIcon />
          <AdvanceOptions />
        </View>
      </ScrollView>
      <View className="bg-black/5 w-full py-5 px-5">
        <TouchableOpacity
          activeOpacity={1}
          disabled={loading}
          onPress={handleCreateHabit}
          className={`mb-20 ${loading ? "bg-sky-300" : "bg-sky-500"} w-full text-center py-3 rounded`}
        >
          {loading ? (
            <ActivityIndicator className="text-white" />
          ) : (
            <Text className="text-center text-white text-xl font-medium">
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <StatusBar hidden />
    </ThemedView>
  );
}
