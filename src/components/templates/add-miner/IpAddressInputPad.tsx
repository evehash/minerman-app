import useTheme from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import type { ReactElement } from "react";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface IpAddressInputPadProps {
  value: string;
  onChange(value: string): void;
}

function Key({ label, onPress = () => {} }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.digitPicker, { backgroundColor: theme.buttonColor }]}>
      <Text style={[styles.digit, { fontFamily: theme.fontFamily.regular, color: theme.primaryColor }]}>{label}</Text>
    </Pressable>
  );
}

function IpAddressInputPad({ value, onChange }: IpAddressInputPadProps): ReactElement {
  const onPressKey = (key: string) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
    } else {
      const newValue = value + key;

      if (isValidIpSegment(newValue)) {
        onChange(newValue);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const keys = [
    ["7", "8", "9", "0"],
    ["4", "5", "6", "⌫"],
    ["1", "2", "3", "."],
  ];

  return (
    <>
      {keys.map((row, rowIndex) => (
        <View style={styles.container} key={`row-${rowIndex}`}>
          {row.map((key) => (
            <Key key={key} label={key} onPress={() => onPressKey(key)} />
          ))}
        </View>
      ))}
    </>
  );
}

function isValidIpSegment(ip: string) {
  const segments = ip.split(".");
  if (segments.length > 4) return false; // No más de 4 segmentos

  return segments.every((segment, index) => {
    if (index < segments.length - 1) {
      // Segmentos intermedios deben ser números completos (0-255)
      const num = parseInt(segment, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    } else {
      // El último segmento puede ser incompleto o válido
      if (segment === "") return true;
      const num = parseInt(segment, 10);
      return segment.length <= 3 && !isNaN(num) && num >= 0 && num <= 255;
    }
  });
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 10,
  },
  digit: {
    fontSize: 30,
  },
  digitPicker: {
    alignItems: "center",
    aspectRatio: 1,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  hidden: {
    opacity: 0,
  },
});

export default IpAddressInputPad;
