import { useAuth } from "@/providers/auth-provider";
// import { useNotification } from "@/providers/notification-provider";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  // const { error } = useNotification();
  const { isAuthenticated, user } = useAuth();
  // if (error) {
  //   return (
  //     <View>
  //       <Text>{error.message}</Text>
  //     </View>
  //   );
  // }

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/workspace");
    } else if (!isAuthenticated || !user) {
      router.replace("/signin");
    }
  }, [isAuthenticated, user]);

  return (
    <SafeAreaView>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={30} color={"blue"} />
      </View>
    </SafeAreaView>
  );
}
