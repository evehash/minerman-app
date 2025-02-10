import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import { StyleSheet, Text } from "react-native";

interface HeadingProps {
  as: "md" | "lg";
  children: string;
}

function Heading({ children }: HeadingProps): ReactElement {
  const theme = useTheme();
  //const fontSize = as === "md" ? 18 : 24;
  return (
    <Text style={[styles.heading, { fontFamily: theme.fontFamily.regular, color: theme.secondaryColor }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Heading;
