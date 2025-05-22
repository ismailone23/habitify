import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import React, { useCallback, useState } from "react";
import { ThemedView } from "../ThemedView";
// import { useBottomSheet } from "@gorhom/bottom-sheet";
import ChooseIcon from "./choose-icon";
import ChooseColor from "./choose-color";
import AdvanceOptions from "./advance-options";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "../ThemedText";
import { useHabit } from "@/providers/newhabit-providers";
import { trpc } from "@/utils/trpc";
import { router } from "expo-router";

export default function NewHabit() {
  // const { close } = useBottomSheet();
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
      setBasicData({ description: "", title: "" });
    } catch (error: any) {
      Alert.alert("Occured problem on creating habit", error.message);
    } finally {
      router.back();
      setLoading(false);
    }
  }, [basicData, createHabitApi, utils]);
  const colorScheme = useColorScheme();
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.scrollContainer}>
          <View style={styles.inputContainer}>
            <ThemedText>Name</ThemedText>
            <TextInput
              value={basicData.title}
              onChangeText={(text) =>
                setBasicData((prev) => ({ ...prev, title: text }))
              }
              style={[
                styles.inputTextField,
                colorScheme === "dark" && styles.darkMode,
              ]}
              placeholder=""
            />
          </View>
          <View style={styles.inputContainer}>
            <ThemedText>Description</ThemedText>
            <TextInput
              value={basicData.description}
              onChangeText={(text) =>
                setBasicData((prev) => ({ ...prev, description: text }))
              }
              style={[
                styles.inputTextField,
                colorScheme === "dark" && styles.darkMode,
              ]}
            />
          </View>
          <ChooseColor />
          <ChooseIcon />
          <AdvanceOptions />
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <BlurView intensity={50} style={styles.blurBackground} tint="light" />
        <TouchableOpacity
          activeOpacity={1}
          disabled={loading}
          onPress={handleCreateHabit}
          style={[
            styles.inBtncontainer,
            loading ? styles.loading : styles.notLoading,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text style={styles.text}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
      <StatusBar hidden />
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    flex: 1,
  },
  scrollContainer: {
    flexDirection: "column",
    gap: 12,
    paddingHorizontal: 20,
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    gap: 4,
  },
  inputTextField: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderBottomWidth: 2,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  darkMode: {
    borderColor: "#3F3F46",
    color: "#D1D5DB",
  },
  btnContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    position: "relative",
  },
  blurBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    borderRadius: 10,
  },
  inBtncontainer: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loading: {
    backgroundColor: "#2980b9",
  },
  notLoading: {
    backgroundColor: "#3498db",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
