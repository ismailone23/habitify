import { Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { ThemedView } from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "./bottom-sheet-modal";
import NewHabit from "./newhabit/new-habit";
import { useColorScheme } from "../hooks/useColorScheme";

export default function Navbar() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <SafeAreaView>
        <View className="flex flex-row justify-between items-center px-5">
          <Text className="text-sky-500 font-medium text-xl">
            Habit<Text className="text-neutral-900 dark:text-white">ify</Text>
          </Text>
          <View>
            <TouchableOpacity onPress={handleBottomSheet} activeOpacity={1}>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <CustomBottomSheetModal ref={bottomSheetModalRef}>
        <BottomSheetView className="flex-1 items-center">
          <NewHabit />
        </BottomSheetView>
      </CustomBottomSheetModal>
    </ThemedView>
  );
}
