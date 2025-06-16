import LoadingModal from "@/components/loading-modal";
import WorkspaceNavbar from "@/components/workspace-navbar";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/workspace/habits");
    } else if (!isAuthenticated || !user) {
      router.replace("/signin");
    }
  }, [isAuthenticated, user]);

  return (
    <SafeAreaView>
      <WorkspaceNavbar />
      <LoadingModal />
    </SafeAreaView>
  );
}
