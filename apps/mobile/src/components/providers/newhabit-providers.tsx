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
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
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
  const value = {
    selectedColor,
    setSelectedColor,
    icon,
    setIcon,
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
