import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import type { Dispatch, SetStateAction } from "react";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Alert, Text } from "react-native";
import type { DateData } from "react-native-calendars";
import { Calendar } from "react-native-calendars";
import { Pressable } from "react-native-gesture-handler";

import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import { buildDataForDots, getTailwindColor } from "@/lib";
import { useHabit } from "@/providers/newhabit-providers";
import { defaultSpacing } from "@/utils/theme";
import { trpc } from "@/utils/trpc";

import CustomBackdrop from "./custom-backdrop";
import TrackHeatMap from "./track-heatmap";

interface HabitSheetProps {
  snapPoints?: (string | number)[];
  sheetId: string | null;
  setSheetId: Dispatch<SetStateAction<string | null>>;
}

const HabitSheet = forwardRef<BottomSheetModal, HabitSheetProps>(
  ({ setSheetId, sheetId, snapPoints = ["60%"] }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const colors = useColors();
    const isDark = useIsDark();
    const { setToUpdateId, setIsUpdating } = useHabit();
    const [loading, setLoading] = useState(false);
    const utils = trpc.useUtils();
    const archiveHabit = trpc.habits.archiveHabit.useMutation();

    const { data, isLoading, error } = trpc.habits.getHabitWithId.useQuery({
      id: sheetId,
    });

    const createHabitOptionApi = trpc.habits.createHabitOption.useMutation();

    const handleCalender = useCallback(
      async (day: DateData, id: string | null) => {
        setLoading(true);
        try {
          await createHabitOptionApi.mutateAsync({
            habitId: id,
            timestamp: new Date(day.dateString),
          });

          await utils.habits.getHabitWithId.invalidate();
          await utils.habits.getAllhabits.invalidate();
        } catch (error: any) {
          Alert.alert("Error", error.message);
        } finally {
          setLoading(false);
        }
      },
      [
        createHabitOptionApi,
        utils.habits.getAllhabits,
        utils.habits.getHabitWithId,
      ]
    );

    const archiveHabitCallback = useCallback(
      async (id: string | null) => {
        setLoading(true);
        try {
          await archiveHabit.mutateAsync({ habitId: id });
          await utils.habits.getAllhabits.invalidate();
          sheetRef.current?.close();
          // await utils.habits.getHabitWithId.invalidate();
          setSheetId(null);
        } catch (error: any) {
          Alert.alert("error on deleting habit", error.message);
        } finally {
          setLoading(false);
        }
      },
      [
        archiveHabit,
        setSheetId,
        utils.habits.getAllhabits,
        // utils.habits.getHabitWithId,
      ]
    );
    const handleEdit = useCallback(
      (id: string | null) => {
        setToUpdateId(id);
        setIsUpdating(true);
        sheetRef.current?.close();
      },
      [setIsUpdating, setToUpdateId]
    );

    const markedDates = useMemo(() => {
      if (isLoading) return;
      return data?.habitOptions.reduce(
        (acc, option) => {
          if (option.timestamp instanceof Date) {
            const date = option.timestamp.toISOString().split("T")[0];

            acc[date] = {
              marked: true,
              dotColor: getTailwindColor(data.habit.color, 500)!,
            };
          }
          return acc;
        },
        {} as Record<string, { marked: boolean; dotColor: string }>
      );
    }, [data?.habit.color, data?.habitOptions, isLoading]);

    useImperativeHandle(ref, () => sheetRef.current!, []);

    if (isLoading) {
      return (
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: colors.background,
          }}
          ref={sheetRef}
          snapPoints={["40%"]}
        >
          <BottomSheetView style={{ backgroundColor: colors.background }}>
            <ActivityIndicator size={30} color={"blue"} />
          </BottomSheetView>
        </BottomSheetModal>
      );
    }
    if (!data) {
      return (
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: colors.background,
          }}
          ref={sheetRef}
          snapPoints={["40%"]}
        >
          <BottomSheetView>
            <Text>Failed to fetch</Text>
          </BottomSheetView>
        </BottomSheetModal>
      );
    }

    const { habit, habitOptions } = data;

    const heatmapData = buildDataForDots({
      habitId: sheetId!,
      habitOptions: habitOptions,
    });

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={CustomBackdrop}
        enableDynamicSizing={false}
        index={0}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
        }}
      >
        {error ? (
          <Text>{error.message}</Text>
        ) : (
          <BottomSheetView style={{ paddingHorizontal: defaultSpacing * 2 }}>
            <BottomSheetView>
              <BottomSheetView
                style={{
                  flexDirection: "row",
                  columnGap: defaultSpacing,
                  alignItems: "flex-start",
                }}
              >
                <Pressable
                  style={{
                    backgroundColor: getTailwindColor(habit.color, 500),
                    padding: 8,
                    borderRadius: 5,
                  }}
                >
                  <Ionicons
                    size={30}
                    name={habit.icon as any}
                    color={colors.foreground}
                  />
                </Pressable>
                <BottomSheetView style={{ flexDirection: "column", flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.foreground,
                      fontFamily: "Roboto",
                    }}
                  >
                    {habit.title}
                  </Text>
                  <Text
                    style={{ color: colors.foreground, fontFamily: "Roboto" }}
                  >
                    {habit.description}
                  </Text>
                </BottomSheetView>
                <BottomSheetView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: defaultSpacing,
                    columnGap: 5,
                  }}
                >
                  <Link asChild href={"/workspace/new-habit-modal"}>
                    <Pressable onPress={() => handleEdit(sheetId)}>
                      <Ionicons
                        name="create-outline"
                        color={colors.foreground}
                        size={25}
                      />
                    </Pressable>
                  </Link>
                  <Pressable
                    onPress={() => archiveHabitCallback(sheetId)}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size={25} color={"blue"} />
                    ) : (
                      <Ionicons
                        size={25}
                        color={colors.destructive}
                        name="archive-outline"
                      />
                    )}
                  </Pressable>
                </BottomSheetView>
              </BottomSheetView>
            </BottomSheetView>
            <BottomSheetView>
              <TrackHeatMap data={heatmapData} color={habit.color} />
            </BottomSheetView>
            <BottomSheetView style={{ marginTop: defaultSpacing }}>
              <Calendar
                theme={{
                  backgroundColor: isDark
                    ? colors.secondary
                    : colors.background,
                  calendarBackground: colors.background,
                  dayTextColor: colors.foreground,
                  monthTextColor: colors.foreground,
                  selectedDayBackgroundColor: getTailwindColor(
                    habit.color,
                    500
                  ),
                  todayTextColor: getTailwindColor(habit.color, 700),
                }}
                markedDates={markedDates}
                onDayPress={(day) => handleCalender(day, sheetId)}
              />
            </BottomSheetView>
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  }
);

export default HabitSheet;
