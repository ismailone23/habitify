import dayjs from "dayjs";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

export interface AdvanceFieldType {
  reminderFrequency: "Daily" | "Weekly" | "Custom" | "None";
  reminderDays: string[];
  reminderEnabled: boolean;
  reminderTime: string;
  timezone: string;
}
interface NewHabitContextType {
  isUpdating: boolean;
  toUpdateId: string | null;
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  setToUpdateId: Dispatch<SetStateAction<string | null>>;
  setAdvanceFieldData: Dispatch<SetStateAction<AdvanceFieldType>>;
  advanceFieldData: AdvanceFieldType;
}
const NewHabitContext = createContext<NewHabitContextType>(
  {} as NewHabitContextType
);

export default function NewHabitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [toUpdateId, setToUpdateId] = useState<string | null>(null);

  const [advanceFieldData, setAdvanceFieldData] = useState<AdvanceFieldType>({
    reminderDays: [],
    reminderEnabled: false,
    reminderFrequency: "None",
    reminderTime: dayjs().startOf("day").format("HH:mm"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const contextValue: NewHabitContextType = useMemo(
    () => ({
      isUpdating,
      setIsUpdating,
      toUpdateId,
      setToUpdateId,
      advanceFieldData,
      setAdvanceFieldData,
    }),
    [isUpdating, advanceFieldData, toUpdateId]
  );

  return (
    <NewHabitContext.Provider value={contextValue}>
      {children}
    </NewHabitContext.Provider>
  );
}

export const useHabit = () => {
  const context = useContext(NewHabitContext);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context) throw new Error("hooks called outside providers");
  return context;
};
