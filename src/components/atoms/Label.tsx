import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import { Text } from "react-native";

interface LabelProps {
  children: string;
}

function Label({ children }: LabelProps): ReactElement {
  const theme = useTheme();
  return <Text style={{ fontFamily: theme.regularFontFamily, color: theme.secondaryColor }}>{children}</Text>;
}

export default Label;
