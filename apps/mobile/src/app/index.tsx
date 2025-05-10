import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  Pressable,
  StyleSheet,
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
    <ThemedView style={styles.themedView}>
      <View style={styles.container}>
        <Text style={styles.text}>Habitify - Your Habit Assistat</Text>
        <ThemedText style={styles.ctext}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi
          pariatur minus delectus sit, earum, modi vel consectetur cupiditate
          nemo sunt vitae accusantium quam! Id recusandae modi et eaque sequi
          asperiores inventore?
        </ThemedText>
      </View>
      <View style={styles.btnContainer}>
        <Pressable
          onPress={handleSignIn}
          disabled={isLoading}
          style={[
            styles.button,
            isLoading ? styles.loading : styles.notLoading,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.btnText}>Continue With Habitify</Text>
          )}
        </Pressable>
      </View>
      <StatusBar hidden={false} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  themedView: {
    width: "100%",
    height: "100%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    paddingVertical: 20,
    fontWeight: "bold",
  },
  ctext: {
    textAlign: "center",
  },
  btnContainer: {
    width: "100%",
  },
  button: {
    marginBottom: 40,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 8,
  },
  loading: {
    backgroundColor: "#7dd3fc",
  },
  notLoading: {
    backgroundColor: "#0ea5e9",
  },
  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
});
