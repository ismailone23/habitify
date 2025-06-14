import { DEFAULT_RECENT_ICONS_LIST, IconsWithTopics } from "@/data/icons";
import { icons, LucideIcon } from "lucide-react-native";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

const MAX_RECENT_ICONS = 12;

export interface IconsContextValue {
  allIcons: [string, LucideIcon][];
  recentIcons: [string, LucideIcon][];
  getIcon: (name: string) => LucideIcon | null;
  addToRecentIcons: (name: string) => Promise<void>;
}

export const IconsContext = createContext<IconsContextValue | null>(null);

const RECENT_ICONS_LIST_KEY = "recent-icons-list";

export default function IconsProvider({ children }: { children: ReactNode }) {
  const [recentIconsList, setRecentIconsList] = useState<string[]>([]);

  const allIcons: [string, LucideIcon][] = Object.values(IconsWithTopics)
    .flat()
    .map((iconName) => {
      // eslint-disable-next-line import/namespace
      const IconComponent = icons[iconName as keyof typeof icons];
      if (!IconComponent) {
        throw new Error(
          `Icon "${iconName}" (mapped to ${iconName}) not found in icons object`
        );
      }
      return [iconName, IconComponent] as [string, LucideIcon];
    });

  const getIcon = useCallback(
    (name: string) => {
      const icon = allIcons.find((icon) => icon[0] === name)?.[1];
      return icon ?? null;
    },
    [allIcons]
  );

  const recentIcons = useMemo(() => {
    return recentIconsList
      .map<[string, LucideIcon] | null>((iconName) => {
        const Icon = getIcon(iconName);
        if (!Icon) {
          return null;
        }
        return [iconName, Icon];
      })
      .filter((icon) => !!icon);
  }, [getIcon, recentIconsList]);

  const addToRecentIcons = useCallback(
    async (name: string) => {
      const list = [...new Set([name, ...recentIconsList])].slice(
        0,
        MAX_RECENT_ICONS
      );
      setRecentIconsList(list);
      await AsyncStorage.setItem(RECENT_ICONS_LIST_KEY, JSON.stringify(list));
    },
    [recentIconsList]
  );

  useEffect(() => {
    void AsyncStorage.getItem(RECENT_ICONS_LIST_KEY).then((result) => {
      if (result) {
        try {
          const icons = z.array(z.string()).parse(JSON.parse(result));
          setRecentIconsList(icons.slice(0, MAX_RECENT_ICONS));
          return;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {}
      }
      setRecentIconsList(DEFAULT_RECENT_ICONS_LIST);
    });
  }, []);

  return (
    <IconsContext.Provider
      value={{ allIcons, getIcon, recentIcons, addToRecentIcons }}
    >
      {children}
    </IconsContext.Provider>
  );
}
export const useIcons = () => {
  const context = useContext(IconsContext);
  if (!context) {
    throw new Error("useIcons must use inside IconsProvider");
  }
  return context;
};
