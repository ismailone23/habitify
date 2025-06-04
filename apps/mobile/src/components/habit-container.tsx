/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/utils/theme";
import { trpc } from "@/utils/trpc";

import HabitMap from "./habit-map";
import HabitSheet from "./habit-sheet";
import Loading from "./Loading";

export default function HabitContainer() {
  const {
    data: habits,
    isLoading,
    isError,
    refetch,
  } = trpc.habits.getAllhabits.useQuery({ isArchived: false });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [sheetId, setSheetId] = useState<string | null>(null);

  const handlePresentModalPress = useCallback((id: string) => {
    setSheetId(id);
    bottomSheetModalRef.current?.present();
  }, []);
  const colors = useColors();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text style={{ color: colors.destructive }}>Something went wrong</Text>
      </View>
    );
  }
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        {!habits || habits.length < 1 ? (
          <View>
            <Text
              style={{
                color: colors.placeholder,
                fontFamily: "Roboto",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Nothing to show
            </Text>
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item, index) => item.habit.id ?? index.toString()}
            renderItem={({ item }) => (
              <HabitMap
                handlePresentModalPress={handlePresentModalPress}
                habit={item.habit}
                isCompletedToday={item.isCompletedToday}
                habitOptions={
                  item.habitOptions.filter(
                    (opt) => opt.habitId === item.habit.id
                  ) ?? []
                }
              />
            )}
            onRefresh={refetch}
            contentContainerStyle={{ paddingBottom: defaultSpacing }}
          />
        )}
      </View>
      <HabitSheet
        sheetId={sheetId}
        setSheetId={setSheetId}
        ref={bottomSheetModalRef}
      />
    </>
  );
}
