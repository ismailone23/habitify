import ListContainer from "@/components/listcontainer";
import LoadingModal from "@/components/loading-modal";
import HabitSheet from "@/components/sheets/habit-sheet";
import { defaultSpacing } from "@/constants/theme";
import { useColors } from "@/hooks/useColor";
import { trpc } from "@/lib/trpc";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function ListView() {
  const { data, isLoading } = trpc.habit.getAllHabits.useQuery({
    status: "active",
  });
  const colors = useColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetId, setSheetId] = useState<string | null>(null);

  const handlePresentModalPress = useCallback((id: string) => {
    setSheetId(id);
    bottomSheetModalRef.current?.present();
  }, []);
  if (isLoading) {
    return <LoadingModal />;
  }
  if (!data || data.length < 1) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.foreground }}>Nothing to show</Text>
      </View>
    );
  }
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          paddingHorizontal: defaultSpacing,
          backgroundColor: colors.background,
        }}
      >
        <ScrollView>
          {data.map((habit, i) => (
            <ListContainer
              handlePresentModalPress={handlePresentModalPress}
              data={habit}
              key={i}
            />
          ))}
        </ScrollView>
      </View>
      {sheetId && (
        <HabitSheet
          sheetId={sheetId}
          setSheetId={setSheetId}
          ref={bottomSheetModalRef}
        />
      )}
    </>
  );
}
