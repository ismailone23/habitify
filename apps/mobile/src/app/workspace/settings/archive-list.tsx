import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { useColors } from "@/hooks/useColor";
import { trpc } from "@/lib/trpc";
import { defaultSpacing } from "@/constants/theme";
import { getColorGroup } from "@/lib";

export default function ArchiveList() {
  const { data, isLoading, refetch } = trpc.habit.getAllHabits.useQuery({
    status: "archived",
  });
  const colors = useColors();
  const restoreApi = trpc.habit.updateStatus.useMutation();
  const destructiveApi = trpc.habit.deleteHabit.useMutation();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);
  const handleRestoreionHabit = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        await restoreApi.mutateAsync({ hid: id, status: "active" });
        await utils.habit.getAllHabits.invalidate();
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    },
    [restoreApi, utils.habit.getAllHabits]
  );

  const handleDestructionHabit = useCallback(
    (id: string) => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await destructiveApi.mutateAsync({ id });
                await refetch();
              } catch (error: any) {
                Alert.alert("Error", error.message);
              }
            },
          },
        ],
        { cancelable: true }
      );
    },
    [destructiveApi, refetch]
  );

  return (
    <View
      style={{
        paddingHorizontal: defaultSpacing,
      }}
    >
      {isLoading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={35} color={colors.primary} />
        </View>
      ) : (
        <View style={{ flexDirection: "column" }}>
          {!data || data.length < 1 ? (
            <Text
              style={{
                fontSize: 16,
                fontStyle: "italic",
                fontFamily: "Roboto",
              }}
            >
              No Habit found in Archived list
            </Text>
          ) : (
            <View style={{ flexDirection: "column" }}>
              {data.map((archabit, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    borderBottomColor: getColorGroup(archabit.habit.color)[5],
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={{ fontWeight: "600", fontFamily: "Roboto" }}>
                    {archabit.habit.name}
                  </Text>
                  <View style={{ flexDirection: "row", columnGap: 10 }}>
                    <Pressable
                      onPress={() => handleRestoreionHabit(archabit.habit.id)}
                    >
                      {loading ? (
                        <ActivityIndicator size={25} color={"blue"} />
                      ) : (
                        <Ionicons
                          size={25}
                          color={colors.primary}
                          name="refresh"
                        />
                      )}
                    </Pressable>
                    <Pressable
                      onPress={() => handleDestructionHabit(archabit.habit.id)}
                    >
                      <Ionicons
                        name="trash"
                        color={colors.destructive}
                        size={24}
                      />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
