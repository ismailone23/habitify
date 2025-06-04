import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useColors } from "@/hooks/useColor";
import { useHabit } from "@/providers/newhabit-providers";
import { defaultSpacing } from "@/utils/theme";
import { trpc } from "@/utils/trpc";

import AdvanceOptions from "./advance-options";
import ChooseColor from "./choose-color";
import ChooseIcon from "./choose-icon";
import FormInput from "./form-input";

interface Data {
  icon: string;
  color: string;
}
export default function NewHabit() {
  const [habitData, setHabitData] = useState<Data>({
    color: "red",
    icon: "airplane-outline",
  });

  const {
    isUpdating,
    toUpdateId,
    setToUpdateId,
    setIsUpdating,
    advanceFieldData,
    setAdvanceFieldData,
  } = useHabit();

  const [loading, setLoading] = useState(false);

  const utils = trpc.useUtils();
  const createHabitApi = trpc.habits.createHabit.useMutation();
  const updateHabitApi = trpc.habits.updateHabit.useMutation();

  const { data } = trpc.habits.getHabitWithId.useQuery(
    { id: toUpdateId },
    { enabled: isUpdating }
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data && toUpdateId) {
      const {
        habit: {
          color,
          icon,
          title,
          description,
          reminderDays,
          reminderEnabled,
          reminderFrequency,
          reminderTime,
          timezone,
        },
      } = data;
      reset({
        title: title,
        description: description,
      });
      setHabitData({
        color: color,
        icon: icon,
      });
      setAdvanceFieldData({
        reminderDays,
        reminderEnabled,
        reminderFrequency,
        reminderTime,
        timezone,
      });
    }
  }, [data, reset, setAdvanceFieldData, toUpdateId]);

  const handleCreateHabit = useCallback(
    async (
      formValues: { title: string; description: string } & {
        id: string | null;
        habitData: Data;
      }
    ) => {
      const { title, description, id = null } = formValues;
      setLoading(true);

      try {
        if (id && isUpdating) {
          await updateHabitApi.mutateAsync({
            habitId: id,
            ...habitData,
            title,
            description,
            ...advanceFieldData,
          });
        } else {
          await createHabitApi.mutateAsync({
            ...habitData,
            title,
            description,
            ...advanceFieldData,
          });
        }

        await utils.habits.getAllhabits.invalidate();

        setHabitData({
          color: "red",
          icon: "airplane-outline",
        });
        setAdvanceFieldData({
          reminderDays: [],
          reminderEnabled: false,
          reminderFrequency: "None",
          reminderTime: "",
          timezone: "",
        });
        reset();
        setToUpdateId(null);
        setIsUpdating(false);
        router.push("/workspace");
      } catch (error: any) {
        Alert.alert("Occured problem on creating habit", error.message);
      } finally {
        setLoading(false);
      }
    },
    [
      isUpdating,
      utils.habits.getAllhabits,
      setAdvanceFieldData,
      reset,
      setToUpdateId,
      setIsUpdating,
      updateHabitApi,
      habitData,
      advanceFieldData,
      createHabitApi,
    ]
  );

  const colors = useColors();
  if (toUpdateId && !data) {
    return <Text>Something went wrong</Text>;
  }
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View
            style={{
              flexDirection: "column",
              rowGap: 10,
              paddingHorizontal: defaultSpacing,
            }}
          >
            <FormInput
              name="title"
              label="Title"
              control={control}
              rules={{ required: "Title is required" }}
            />
            <FormInput
              name="description"
              label="Description"
              control={control}
            />
            <ChooseColor
              colorName={habitData.color}
              setHabitData={setHabitData}
            />
            <ChooseIcon icon={habitData.icon} setHabitData={setHabitData} />
            <AdvanceOptions />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View
        style={{
          paddingVertical: defaultSpacing,
          backgroundColor: colors.background,
          paddingHorizontal: defaultSpacing,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          disabled={loading}
          onPress={handleSubmit((values) =>
            handleCreateHabit({ ...values, id: toUpdateId, habitData })
          )}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            height: defaultSpacing * 3,
          }}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text
              style={{
                fontWeight: "bold",
                color: colors.destructiveForeground,
                fontSize: 16,
              }}
            >
              {isUpdating ? "Update" : "Save"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <StatusBar hidden />
    </View>
  );
}
