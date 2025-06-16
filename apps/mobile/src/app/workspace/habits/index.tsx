/* eslint-disable react-hooks/exhaustive-deps */
import { View, Text, ListRenderItemInfo, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useNotification } from "@/providers/notification-provider";
import { trpc } from "@/lib/trpc";
import { FlatList } from "react-native-gesture-handler";
import { useColors } from "@/hooks/useColor";
import LoadingModal from "@/components/loading-modal";
import { HabitDataType } from "@repo/api/types";
import { StatusBar } from "expo-status-bar";
import { defaultBorderRadius, defaultSpacing } from "@/constants/theme";
import { useIsDark } from "@/hooks/useColorScheme";
import HabitMap from "@/components/habit-map";
import HabitSheet from "@/components/sheets/habit-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkspaceNavbar from "@/components/workspace-navbar";

export default function Workspace() {
  const { user } = useAuth();
  const { expoPushToken } = useNotification();
  const updateUserApi = trpc.auth.updateUser.useMutation();
  const colors = useColors();
  const { data, isLoading, error, refetch } = trpc.habit.getAllHabits.useQuery(
    {}
  );

  useEffect(() => {
    const handlePushToken = async () => {
      if (user && !user.expoPushToken && expoPushToken) {
        return await updateUserApi.mutateAsync({ expoPushToken });
      }
      return;
    };
    void handlePushToken();
  }, []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [sheetId, setSheetId] = useState<string | null>(null);
  const handlePresentModalPress = useCallback((id: string) => {
    setSheetId(id);
    bottomSheetModalRef.current?.present();
  }, []);
  const renderItem = useCallback(
    ({ index, item }: ListRenderItemInfo<HabitDataType>) => {
      return (
        <HabitMap
          handlePresentModalPress={handlePresentModalPress}
          habit={item.habit}
          options={
            item.options.filter((opt) => opt.habitId === item.habit.id) ?? []
          }
        />
      );
    },
    []
  );
  const isDark = useIsDark();
  if (isLoading) {
    return <LoadingModal />;
  }
  if (!data || data.length < 1) {
    return (
      <View style={{ height: "100%", justifyContent: "center" }}>
        <Text style={{ color: colors.foreground, textAlign: "center" }}>
          Nothing to show.
        </Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ height: "100%", justifyContent: "center" }}>
        <Text style={{ color: colors.destructive, textAlign: "center" }}>
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View
        style={{
          paddingHorizontal: defaultSpacing,
          height: "100%",
          backgroundColor: colors.background,
        }}
      >
        <WorkspaceNavbar />
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.habit.id ?? index.toString()}
          renderItem={renderItem}
          onRefresh={refetch}
          ItemSeparatorComponent={() => (
            <View style={{ height: defaultSpacing / 2 }} />
          )}
          contentContainerStyle={{ paddingBottom: defaultSpacing }}
        />
        <Link asChild href={"/workspace/new-habit"}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              position: "absolute",
              right: defaultSpacing * 2,
              bottom: defaultSpacing * 4,
              backgroundColor: colors.primary,
              padding: defaultSpacing * 0.7,
              borderRadius: defaultBorderRadius * 3,
            }}
          >
            <Plus size={24} color={colors.primaryForeground} />
          </TouchableOpacity>
        </Link>
        <StatusBar style={isDark ? "light" : "dark"} />
        {sheetId && (
          <HabitSheet
            sheetId={sheetId}
            setSheetId={setSheetId}
            ref={bottomSheetModalRef}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
