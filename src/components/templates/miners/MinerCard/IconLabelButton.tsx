import type { IconName } from "@/components/atoms/Icon";
import Icon from "@/components/atoms/Icon";
import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IconLabelButtonProps {
  icon: IconName;
  label: string;
  onPress(): void;
  disabled?: boolean;
  style?: object;
  iconSize?: number;
}

function IconLabelButton({
  icon,
  label,
  onPress,
  disabled = false,
  style,
  iconSize = 30,
}: IconLabelButtonProps): ReactElement {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, style]}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={iconSize} color={"white"} />
      </View>
      <Text style={[styles.label, { color: theme.primaryColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
  },
});

export default IconLabelButton;
