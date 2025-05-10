import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import HabitMap from "./habit-map";
import { trpc } from "@/utils/trpc";
import { TAILWIND_COLORS } from "@/constants/Icons";
import { BlurView } from "expo-blur";
import { useHabit } from "@/providers/newhabit-providers";
import FocusHabit from "./focused/focus-habit";

export default function HabitContainer() {
  const {
    data: habits,
    isLoading,
    isError,
  } = trpc.habits.getAllhabits.useQuery();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={TAILWIND_COLORS.sky[500]} size={25} />
      </View>
    );
  }

  if (!isLoading && isError) {
    return (
      <View>
        <Text style={styles.errorText}>Something went wrong</Text>
      </View>
    );
  }
  const { modalVisible, setModalVisible } = useHabit();
  const handleHabitFocus = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, [setModalVisible]);
  return (
    <>
      <FlatList
        data={habits}
        renderItem={({ index, item }) => (
          <HabitMap
            key={index}
            habit={item.habit}
            isCompletedToday={item.isCompletedToday}
            habitOptions={item.habitOptions.filter(
              (hasd) => hasd.habitId === item.habit.id
            )}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.contentColumn}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleHabitFocus}
      >
        <BlurView intensity={100} style={styles.blurContainer}>
          <FocusHabit />
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "#f87171",
  },
  contentColumn: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // For Android shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 10, // For iOS shadow
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
