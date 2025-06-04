import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import HabitSheet from "@/components/habit-sheet";
import ListContainer from "@/components/listcontainer";
import Loading from "@/components/Loading";
import { useColors } from "@/hooks/useColor";
import { defaultSpacing } from "@/utils/theme";
import { trpc } from "@/utils/trpc";

export default function ListView() {
  const { data, isLoading } = trpc.habits.getAllhabits.useQuery({
    isArchived: false,
  });
  const colors = useColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetId, setSheetId] = useState<string | null>(null);

  const handlePresentModalPress = useCallback((id: string) => {
    setSheetId(id);
    bottomSheetModalRef.current?.present();
  }, []);
  if (isLoading) {
    return <Loading />;
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
      <HabitSheet
        setSheetId={setSheetId}
        sheetId={sheetId}
        ref={bottomSheetModalRef}
      />
    </>
  );
}
