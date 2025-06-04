import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Loading from "@/components/Loading";
import { useAuth } from "@/providers/AuthProvider";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const check = () => {
      if (isAuthenticated) {
        router.replace("/workspace");
      } else {
        router.replace("/(auth)/login");
      }
    };
    void check();
  }, [isAuthenticated, router]);

  return (
    <SafeAreaView>
      <Loading />
    </SafeAreaView>
  );
}
