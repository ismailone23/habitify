import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateHabitInput,
  CreateHabitInputSchema,
  Habit,
} from "@repo/api/validators";
import React, { createContext, ReactNode, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

export interface HabitFormContextValue {
  habit?: Habit | null;
  form: UseFormReturn<CreateHabitInput>;
}

export const HabitFormContext = createContext<HabitFormContextValue | null>(
  null
);

export interface HabitFormProviderProps {
  children: ReactNode;
  habit?: Habit | null;
}

export default function HabitFormProvider({
  children,
  habit,
}: HabitFormProviderProps) {
  const form = useForm<CreateHabitInput>({
    resolver: zodResolver(CreateHabitInputSchema),
    defaultValues: {
      name: habit?.name ?? "",
      description: habit?.description ?? null,
      startDate: habit?.startDate ?? new Date(),
      endDate: habit?.endDate ?? null,
      color: habit?.color ?? "",
      icon: habit?.icon ?? "",
      frequency: habit?.frequency ?? {
        type: "daily",
        targetCount: 1,
        targetDays: null,
        time: "10:00",
      },
      timezone:
        habit?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  return (
    <HabitFormContext.Provider value={{ habit, form }}>
      {children}
    </HabitFormContext.Provider>
  );
}

export const useHabitForm = () => {
  const context = useContext(HabitFormContext);
  if (!context) {
    throw new Error("useHabitForm must use inside HabitFormProvider");
  }
  return context;
};
