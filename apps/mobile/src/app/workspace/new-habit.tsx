import Button from "@/components/button";
import LucideIconButton from "@/components/lucide-icon-button";
import IconPickerSheet from "@/components/sheets/icon-picker-sheet";
import TextField from "@/components/text-field";
import { defaultBorderRadius, defaultSpacing } from "@/constants/theme";
import { HABIT_COLORS } from "@/data/color-palettes";
import { useColors } from "@/hooks/useColor";
import HabitFormProvider, { useHabitForm } from "@/providers/habit-form";
import { useIcons } from "@/providers/icons-provider";
import dayjs from "@/utils/dayjs";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Minus, Plus, XIcon } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import RNDateTimePicker from "@react-native-community/datetimepicker";

import {
  CreateHabitInput,
  DaysOfWeekEnum,
  FrequencyTypeEnum,
} from "@repo/api/validators";
import { trpc } from "@/lib/trpc";
import { Link, router } from "expo-router";

export default function NewHabitScreen() {
  return (
    <HabitFormProvider>
      <InnerCreateHabitForm />
    </HabitFormProvider>
  );
}

function InnerCreateHabitForm() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { form } = useHabitForm();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { allIcons, recentIcons, addToRecentIcons } = useIcons();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const createHabitApi = trpc.habit.createHabit.useMutation();
  const utils = trpc.useUtils();

  const handleCreateHabit = useCallback(
    async (data: CreateHabitInput) => {
      setLoading(true);
      try {
        await createHabitApi.mutateAsync(data);
        await utils.habit.getAllHabits.invalidate();
        form.reset();
        router.push("/workspace/habits");
      } catch (error: any) {
        Alert.alert("Something went wrong.", error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [createHabitApi, form, utils.habit.getAllHabits]
  );

  return (
    <SafeAreaView>
      <View
        style={{
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={{ paddingHorizontal: defaultSpacing }}>
          <Link href={"/workspace/habits"} asChild>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                alignItems: "center",
                flexDirection: "row",
                columnGap: 5,
                marginTop: 5,
              }}
            >
              <XIcon size={20} color={colors.foreground} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        <ScrollView>
          <View
            style={{
              padding: defaultSpacing,
              gap: defaultSpacing,
            }}
          >
            <Controller
              control={form.control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.foreground,
                    }}
                  >
                    Habit Name
                  </Text>
                  <TextField
                    placeholder="Run Everyday"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {form.formState.errors.name && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.destructive,
                      }}
                    >
                      {form.formState.errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.foreground,
                    }}
                  >
                    Description
                  </Text>
                  <TextField
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                  {form.formState.errors.description && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.destructive,
                      }}
                    >
                      {form.formState.errors.description.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="icon"
              render={({ field: { onChange, value } }) => (
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.foreground,
                    }}
                  >
                    Icon
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: defaultSpacing / 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {recentIcons.map(([name, Icon]) => {
                      const selected = name === value;
                      return (
                        <LucideIconButton
                          key={name}
                          Icon={Icon}
                          iconSize={40 * 0.6}
                          onPress={() => {
                            onChange(name);
                            addToRecentIcons(name);
                          }}
                          selected={selected}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      );
                    })}
                    <Button
                      variant="outline"
                      style={{
                        height: 40,
                        borderRadius: defaultBorderRadius,
                      }}
                      onPress={() => sheetRef.current?.present()}
                    >
                      More Icons
                    </Button>

                    <IconPickerSheet
                      ref={sheetRef}
                      icons={allIcons}
                      value={value}
                      onSelect={(name) => {
                        onChange(name);
                        addToRecentIcons(name);
                      }}
                    />
                  </View>
                  {form.formState.errors.icon && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.destructive,
                      }}
                    >
                      {form.formState.errors.icon.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="color"
              render={({ field: { onChange, value } }) => (
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.foreground,
                    }}
                  >
                    Color
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: defaultSpacing / 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {HABIT_COLORS.map((color) => {
                      const selected = color === value;
                      return (
                        <TouchableOpacity
                          key={color}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: color,
                            width: 38,
                            height: 38,
                            borderRadius: defaultBorderRadius * 0.7,
                          }}
                          onPress={() => onChange(color)}
                        >
                          {selected && (
                            <View
                              style={{
                                width: 15,
                                height: 15,
                                borderRadius: 5,
                                backgroundColor: colors.background,
                              }}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {form.formState.errors.color && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.destructive,
                      }}
                    >
                      {form.formState.errors.color.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="frequency.type"
              render={({ field: { onChange, value } }) => (
                <View style={{ gap: 4 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: colors.foreground,
                    }}
                  >
                    Reminder Frequncy
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: defaultSpacing / 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {FrequencyTypeEnum.options.map((opt, i) => {
                      const selected = opt === value;
                      return (
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: defaultSpacing,
                            paddingVertical: defaultSpacing * 0.5,
                            borderRadius: defaultBorderRadius * 0.7,
                            borderWidth: 1,
                            borderColor: selected
                              ? colors.primary
                              : colors.border,
                            backgroundColor: selected
                              ? colors.primary
                              : "transparent",
                          }}
                          key={i}
                          onPress={() => onChange(opt)}
                        >
                          <Text
                            style={{
                              color: selected
                                ? colors.primaryForeground
                                : colors.foreground,
                            }}
                          >
                            {opt.at(0)?.toUpperCase() + opt.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {form.formState.errors.color && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.destructive,
                      }}
                    >
                      {form.formState.errors.color.message}
                    </Text>
                  )}
                </View>
              )}
            />
            {form.watch("frequency.type") === "custom" && (
              <Controller
                control={form.control}
                name="frequency.targetDays"
                render={({ field: { onChange, value } }) => (
                  <View style={{ gap: 4 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.foreground,
                      }}
                    >
                      Days
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        gap: defaultSpacing / 2,
                        flexWrap: "wrap",
                      }}
                    >
                      {DaysOfWeekEnum.options.map((opt, i) => {
                        const selected = value?.includes(opt);
                        return (
                          <TouchableOpacity
                            style={{
                              paddingHorizontal: defaultSpacing,
                              paddingVertical: defaultSpacing * 0.5,
                              borderRadius: defaultBorderRadius * 0.7,
                              borderWidth: 1,
                              borderColor: selected
                                ? colors.primary
                                : colors.border,
                              backgroundColor: selected
                                ? colors.primary
                                : "transparent",
                            }}
                            key={i}
                            onPress={() => {
                              const newValue = value?.includes(opt)
                                ? value.filter((day) => day !== opt)
                                : [...(value ?? []), opt];

                              onChange(newValue);
                            }}
                          >
                            <Text
                              style={{
                                color: selected
                                  ? colors.primaryForeground
                                  : colors.foreground,
                              }}
                            >
                              {opt.at(0)?.toUpperCase() + opt.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {form.formState.errors.color && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.destructive,
                        }}
                      >
                        {form.formState.errors.color.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                columnGap: defaultSpacing,
              }}
            >
              <Controller
                control={form.control}
                name="frequency.targetCount"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ gap: 4, flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.foreground,
                      }}
                    >
                      Target Count
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        columnGap: 5,
                        alignItems: "center",
                      }}
                    >
                      <LucideIconButton
                        Icon={Minus}
                        iconSize={40 * 0.6}
                        onPress={() => {
                          onChange(value > 0 ? value - 1 : 0);
                        }}
                        selected={false}
                        style={{
                          width: 43,
                          height: 43,
                        }}
                      />
                      <TextField
                        value={value.toString() ?? "0"}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        style={{ flex: 1, textAlign: "center" }}
                        keyboardType="number-pad"
                        editable={false}
                      />
                      <LucideIconButton
                        Icon={Plus}
                        iconSize={40 * 0.6}
                        onPress={() => {
                          onChange(value + 1);
                        }}
                        selected={false}
                        style={{
                          width: 43,
                          height: 43,
                        }}
                      />
                    </View>
                    {form.formState.errors.description && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.destructive,
                        }}
                      >
                        {form.formState.errors.description.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="frequency.time"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ gap: 4, flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: colors.foreground,
                      }}
                    >
                      Time
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        columnGap: defaultSpacing,
                      }}
                    >
                      <View>
                        <TouchableOpacity
                          onPress={() => setShow(true)}
                          style={{
                            backgroundColor: colors.primary,
                            paddingVertical: 8,
                            marginTop: 4,
                            paddingHorizontal: 12,
                            borderRadius: 6,
                          }}
                        >
                          <Text style={{ color: colors.primaryForeground }}>
                            {value || "Set Time"}
                          </Text>
                        </TouchableOpacity>

                        {show && (
                          <RNDateTimePicker
                            value={new Date(value ?? "")}
                            mode="time"
                            display={
                              Platform.OS === "ios" ? "spinner" : "clock"
                            }
                            onChange={(event, selectedDate) => {
                              setShow(false);
                              if (selectedDate) {
                                const formatted =
                                  dayjs(selectedDate).format("HH:mm");
                                onChange(formatted);
                              }
                            }}
                            positiveButton={{
                              label: "OK",
                              textColor: colors.primary,
                            }}
                            negativeButton={{
                              label: "Cancel",
                              textColor: colors.foreground,
                            }}
                            style={{
                              backgroundColor: colors.primary,
                            }}
                          />
                        )}
                      </View>
                    </View>
                    {form.formState.errors.description && (
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.destructive,
                        }}
                      >
                        {form.formState.errors.description.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: colors.background,
            paddingBottom: insets.bottom,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              paddingHorizontal: defaultSpacing,
              paddingVertical: defaultSpacing * 0.5,
            }}
          >
            <Button
              onPress={form.handleSubmit(handleCreateHabit, (error) => {
                console.log(error);
              })}
            >
              {loading ? (
                <ActivityIndicator size={24} color={colors.primaryForeground} />
              ) : (
                "Create Habit"
              )}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
