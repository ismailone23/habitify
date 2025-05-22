import NewHabit from "@/components/newhabit/new-habit";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Modal() {
  const isPresented = router.canGoBack();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 12,
          marginVertical: 8,
        }}
      >
        <Link href="/workspace">
          <Ionicons name="chevron-back" size={24} />
        </Link>
        <Text style={{ textAlign: "center", flex: 1 }}>New Habit</Text>
      </View>
      <NewHabit />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    borderTopWidth: 2,
    borderTopColor: "#F1EFEC",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
