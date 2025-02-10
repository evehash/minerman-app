import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import { StyleSheet, Text } from "react-native";

interface BadgeProps {
  text: string;
}

function Badge({ text }: BadgeProps): ReactElement {
  const theme = useTheme();
  return (
    <Text style={[styles.badge, { fontFamily: theme.regularFontFamily, backgroundColor: theme.color.gray }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 5,
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 16,
    marginLeft: 10,
    marginVertical: 2,
    paddingHorizontal: 5,
  },
});

export default Badge;
