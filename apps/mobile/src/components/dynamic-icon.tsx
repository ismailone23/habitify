import * as LucideIcons from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

export type IconName = keyof typeof LucideIcons;

export default function DynamicLucideIcon({
  name,
  size = 24,
  color = "black",
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  // eslint-disable-next-line import/namespace
  const Icon = LucideIcons[name] as LucideIcon; // 👈 fix: assert as LucideIcon
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}
