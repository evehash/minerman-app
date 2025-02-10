import Heading from "@/components/atoms/Heading";
import type { ReactElement, ReactNode } from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

interface SectionProps {
  name: string;
  style?: ViewStyle;
  children: ReactNode;
}

export function Section({ name, style, children }: SectionProps): ReactElement {
  return (
    <View style={[styles.container, style]}>
      <Heading as="md">{name}</Heading>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});
