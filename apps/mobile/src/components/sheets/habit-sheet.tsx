/* eslint-disable react-hooks/exhaustive-deps */
import { BottomSheetModal } from "@gorhom/bottom-sheet";
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
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { DateData } from "react-native-calendars";
import { Calendar } from "react-native-calendars";
import { Pressable } from "react-native-gesture-handler";

import { useColors } from "@/hooks/useColor";
import { useIsDark } from "@/hooks/useColorScheme";
import { buildDataForDots, getColorGroup } from "@/lib";
import { trpc } from "@/lib/trpc";
import CustomBackdrop from "../custom-backdrop";
import { defaultSpacing } from "@/constants/theme";
import TrackHeatMap from "../track-heatmap";
import DynamicLucideIcon, { IconName } from "../dynamic-icon";
import dayjs from "@/utils/dayjs";
import { FileArchive, Settings2 } from "lucide-react-native";

interface HabitSheetProps {
  snapPoints?: (string | number)[];
  sheetId: string | null;
  setSheetId: Dispatch<SetStateAction<string | null>>;
}

// eslint-disable-next-line react/display-name
const HabitSheet = forwardRef<BottomSheetModal, HabitSheetProps>(
  ({ setSheetId, sheetId, snapPoints = ["65%"] }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const colors = useColors();
    const isDark = useIsDark();
    const [loading, setLoading] = useState(false);
    const utils = trpc.useUtils();
    const updateStatusApi = trpc.habit.updateStatus.useMutation();

    const { data, isLoading, error } = trpc.habit.getHabit.useQuery({
      id: sheetId!,
    });

    const createHabitOptionApi = trpc.habit.optionCount.useMutation();

    const handleCalender = useCallback(async (day: DateData, id: string) => {
      setLoading(true);
      try {
        const utcMidnightDate = dayjs
          .utc(day.dateString)
          .startOf("day")
          .toDate();

        await createHabitOptionApi.mutateAsync({
          hId: id,
          date: utcMidnightDate,
        });

        await utils.habit.getAllHabits.invalidate();
        await utils.habit.getHabit.invalidate({ id });
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    const archiveHabitCallback = useCallback(async (id: string) => {
      setLoading(true);
      try {
        await updateStatusApi.mutateAsync({ hid: id, status: "archived" });
        await utils.habit.getAllHabits.invalidate();
        sheetRef.current?.close();
        setSheetId(null);
      } catch (error: any) {
        Alert.alert("error on deleting habit", error.message);
      } finally {
        setLoading(false);
      }
    }, []);
    const handleEdit = useCallback(() => {
      sheetRef.current?.close();
    }, []);

    const markedDates = useMemo(() => {
      if (isLoading && !data) return;

      const color = getColorGroup(data?.habit.color as string)[5]!;

      return data?.options.reduce(
        (acc, option, index) => {
          if (option.createdAt instanceof Date) {
            const date = option.createdAt.toISOString().split("T")[0];

            const dots = Array.from({ length: option.count }, (_, i) => ({
              key: `${date}-dot-${i}`,
              color,
            }));

            acc[date] = {
              dots,
            };
          }
          return acc;
        },
        {} as Record<string, { dots: { key: string; color: string }[] }>
      );
    }, [data?.habit.color, data?.options, isLoading]);
    useImperativeHandle(ref, () => sheetRef.current!, []);

    if (!data) {
      return (
        <BottomSheetModal
          backgroundStyle={{
            backgroundColor: colors.background,
          }}
          ref={sheetRef}
          index={0}
          snapPoints={["40%"]}
        >
          <View>
            <Text>Failed to fetch</Text>
          </View>
        </BottomSheetModal>
      );
    }

    const { habit, options } = data;

    const heatmapData = buildDataForDots({
      habitId: sheetId!,
      options: options,
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
        onDismiss={() => {
          setSheetId(null);
        }}
      >
        {isLoading ? (
          <View style={{ backgroundColor: colors.background }}>
            <ActivityIndicator size={30} color={"blue"} />
          </View>
        ) : error ? (
          <Text>{error.message}</Text>
        ) : (
          <View
            style={{
              paddingHorizontal: defaultSpacing * 2,
              flexDirection: "column",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                columnGap: defaultSpacing,
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: getColorGroup(habit.color)[1],
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                }}
              >
                <DynamicLucideIcon
                  name={habit.icon as IconName}
                  color={habit.color}
                  size={20}
                />
              </TouchableOpacity>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.foreground,
                    fontFamily: "Roboto",
                  }}
                >
                  {habit.name}
                </Text>
                <Text
                  style={{ color: colors.foreground, fontFamily: "Roboto" }}
                >
                  {habit.description}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: defaultSpacing,
                  columnGap: defaultSpacing,
                }}
              >
                <Link
                  asChild
                  href={{
                    pathname: "/workspace/edit/[hid]",
                    params: { hid: sheetId },
                  }}
                >
                  <Pressable onPress={handleEdit}>
                    <Settings2 color={colors.foreground} size={24} />
                  </Pressable>
                </Link>
                <Pressable
                  onPress={() => archiveHabitCallback(sheetId!)}
                  disabled={loading}
                >
                  <FileArchive size={24} color={colors.destructive} />
                </Pressable>
              </View>
            </View>
            <TrackHeatMap
              targetCount={habit.frequency.targetCount}
              data={heatmapData}
              color={habit.color}
            />
            <View style={{ marginTop: defaultSpacing }}>
              <Calendar
                markingType="multi-dot"
                theme={{
                  backgroundColor: isDark
                    ? colors.secondary
                    : colors.background,
                  calendarBackground: colors.background,
                  dayTextColor: colors.foreground,
                  monthTextColor: colors.foreground,
                  selectedDayBackgroundColor: getColorGroup(habit.color)[5],
                  todayTextColor: getColorGroup(habit.color)[5],
                }}
                markedDates={markedDates}
                onDayPress={(day) => handleCalender(day, sheetId!)}
              />
            </View>
          </View>
        )}
      </BottomSheetModal>
    );
  }
);

export default HabitSheet;
