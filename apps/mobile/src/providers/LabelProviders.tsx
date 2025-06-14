// context/LabelSettingsContext.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { STORAGE_KEYS } from "@/constants/storage-keys";

interface LabelSettingsContextType {
  showMonthLabel: boolean;
  setShowMonthLabel: (value: boolean) => void;
  toggleMonthLabel: () => void;
  showDayLabel: boolean;
  showCategoryList: boolean;
  setShowDayLabel: (value: boolean) => void;
  setShowCategoryList: (value: boolean) => void;
  toggleDayLabel: () => void;
  toggleShowCategoryList: () => void;
}

const LabelSettingsContext = createContext<LabelSettingsContextType | null>(
  null
);

export const LabelSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showMonthLabel, setShowMonthLabel] = useState(false);
  const [showDayLabel, setShowDayLabel] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);

  useEffect(() => {
    const load = async () => {
      const month = await AsyncStorage.getItem(STORAGE_KEYS.MONTH_LABEL_KEY);
      const day = await AsyncStorage.getItem(STORAGE_KEYS.DAY_LABEL_KEY);
      const list = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORY_LABEL_KEY);

      setShowMonthLabel(month === "true");
      setShowDayLabel(day === "true");
      setShowCategoryList(list === "true");
    };
    void load();
  }, []);

  const toggleMonthLabel = useCallback(() => {
    setShowMonthLabel((prev) => {
      const next = !prev;
      void AsyncStorage.setItem(
        STORAGE_KEYS.MONTH_LABEL_KEY,
        JSON.stringify(next)
      );
      return next;
    });
  }, []);

  const toggleDayLabel = useCallback(() => {
    setShowDayLabel((prev) => {
      const next = !prev;
      void AsyncStorage.setItem(
        STORAGE_KEYS.DAY_LABEL_KEY,
        JSON.stringify(next)
      );
      return next;
    });
  }, []);
  const toggleShowCategoryList = useCallback(() => {
    setShowCategoryList((prev) => {
      const next = !prev;
      void AsyncStorage.setItem(
        STORAGE_KEYS.CATEGORY_LABEL_KEY,
        JSON.stringify(next)
      );
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      showMonthLabel,
      setShowMonthLabel,
      toggleMonthLabel,
      showDayLabel,
      setShowDayLabel,
      toggleDayLabel,
      toggleShowCategoryList,
      showCategoryList,
      setShowCategoryList,
    }),
    [
      showDayLabel,
      showMonthLabel,
      toggleDayLabel,
      toggleMonthLabel,
      showCategoryList,
      toggleShowCategoryList,
    ]
  );

  return (
    <LabelSettingsContext.Provider value={contextValue}>
      {children}
    </LabelSettingsContext.Provider>
  );
};

export const useLabelSettings = () => {
  const context = useContext(LabelSettingsContext);
  if (!context) {
    throw new Error(
      "useLabelSettings must be used within LabelSettingsProvider"
    );
  }
  return context;
};
