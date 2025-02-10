import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactElement } from "react";

type IconName =
  | "arrow-down"
  | "cog-outline"
  | "trash-can-outline"
  | "arrow-up"
  | "information-outline"
  | "more"
  | "led-variant-off"
  | "led-on"
  | "speedometer"
  | "speedometer-medium"
  | "speedometer-slow"
  | "restart"
  | "circle-outline"
  | "bitcoin"
  | "circle"
  | "theme-light-dark"
  | "translate"
  | "account-key"
  | "thermometer"
  | "server-network"
  | "plus"
  | "subdirectory-arrow-right"
  | "chevron-right"
  | "handshake-outline"
  | "handshake"
  | "memory"
  | "cube"
  | "home-lightning-bolt"
  | "home-lightning-bolt-outline"
  | "lightning-bolt-circle"
  | "pickaxe"
  | "cube-outline"
  | "fan"
  | "cogs"
  | "lightning-bolt"
  | "alert-outline"
  | "web"
  | "gold"
  | "help-circle-outline"
  | "check-circle-outline"
  | "close-circle-outline";

interface IconProps {
  name: IconName;
  color: string;
  size: number;
}

function Icon({ name, color, size }: IconProps): ReactElement {
  return <MaterialCommunityIcons name={name} color={color} size={size} />;
}

export default Icon;
export type { IconName };
