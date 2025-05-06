import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ ...otherProps }: ThemedViewProps) {
  return <View className="bg-gray-100 dark:bg-neutral-900" {...otherProps} />;
}
