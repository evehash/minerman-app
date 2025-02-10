import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import { Text } from "react-native";

interface TextValueProps {
  children: string | number | undefined;
}

function TextValue({ children }: TextValueProps): ReactElement {
  const theme = useTheme();
  return <Text style={{ fontFamily: theme.regularFontFamily, color: theme.primaryColor }}>{children}</Text>;
}

export default TextValue;
