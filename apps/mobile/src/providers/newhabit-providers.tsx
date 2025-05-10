import { habitData } from "@repo/api/types";
import { HabitOptions, Habits } from "@repo/db/schema";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface NewHabitContextType {
  icon: string;
  setIcon: Dispatch<SetStateAction<string>>;
  modalVisible: boolean;
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusHabitId: React.Dispatch<React.SetStateAction<string | null>>;
  focusHabitId: string | null;
}

const NewHabitContext = createContext<NewHabitContextType>(
  {} as NewHabitContextType
);

export default function NewHabitProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedColor, setSelectedColor] = useState("red");
  const [icon, setIcon] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [focusHabitId, setFocusHabitId] = useState<string | null>(null);
  const value = {
    selectedColor,
    setSelectedColor,
    icon,
    setIcon,
    modalVisible,
    setModalVisible,
    focusHabitId,
    setFocusHabitId,
  };
  return (
    <NewHabitContext.Provider value={value}>
      {children}
    </NewHabitContext.Provider>
  );
}

export const useHabit = () => {
  const context = useContext(NewHabitContext);
  if (!context) throw new Error("hooks called outside providers");
  return context;
};
