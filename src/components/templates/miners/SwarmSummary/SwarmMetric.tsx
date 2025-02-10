import type { IconName } from "@/components/atoms/Icon";
import Icon from "@/components/atoms/Icon";
import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MetricProps {
  title: string;
  value: string;
  iconName: IconName;
  iconColor: string;
}

function SwarmMetric({ iconName, iconColor, title, value }: MetricProps): ReactElement {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Icon name={iconName} color={iconColor} size={25} />
      <View style={styles.column}>
        <Text style={[styles.title, { color: theme.secondaryColor }]}>{title}</Text>
        <Text style={[styles.value, { color: theme.primaryColor }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontSize: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SwarmMetric;
