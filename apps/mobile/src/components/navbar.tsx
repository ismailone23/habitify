import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useRef } from "react";
import { ThemedView } from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "./bottom-sheet-modal";
import NewHabit from "./newhabit/new-habit";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export default function Navbar() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={[styles.text, styles.darkText]}>
            Habit
            <Text style={styles.lightText}>ify</Text>
          </Text>
          <View>
            <TouchableOpacity onPress={handleBottomSheet} activeOpacity={1}>
              <Ionicons name="add-circle-outline" size={30} color={"#0ea5e9"} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <CustomBottomSheetModal ref={bottomSheetModalRef}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <NewHabit />
        </BottomSheetView>
      </CustomBottomSheetModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "500",
  },
  lightText: {
    color: "#0284c7",
  },
  darkText: {
    color: "#111827",
  },
  darkMode: {
    color: "#ffffff",
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: "center",
  },
});
