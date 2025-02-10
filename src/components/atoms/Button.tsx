import useTheme from "@/hooks/useTheme";
import type { ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import type { IconName } from "./Icon";
import Icon from "./Icon";

interface ButtonProps {
  icon?: IconName;
  onPress?(): void;
  style?: StyleProp<ViewStyle>;
  text: string;
  disabled?: boolean;
}

function Button({ icon, onPress, style, text, disabled }: ButtonProps): ReactElement {
  const theme = useTheme();
  const color = disabled ? theme.secondaryColor : theme.primaryColor;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[style, styles.button, { backgroundColor: disabled ? theme.neutralColor : theme.successColor }]}
    >
      {icon && <Icon name={icon} size={18} color={color} />}
      <Text style={[styles.text, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    padding: 15,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 18,
    textAlign: "center",
  },
});

export default Button;
