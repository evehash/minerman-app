/* eslint-disable react-native/no-color-literals */
import type { DeviceAction } from "@/services/deviceService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-simple-toast";

interface DeviceActionButtonProps {
  action: DeviceAction;
}

function DeviceActionButton({ action }: DeviceActionButtonProps): ReactNode {
  const [isRunning, setRunning] = useState(false);
  const opacity = useState(new Animated.Value(1))[0]; // Animated opacity

  const onPress = async () => {
    try {
      setRunning(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      const response = await action.performAction();

      if (response.success) {
        Toast.show(response.message, Toast.SHORT);
      } else {
        Toast.show(response.message, Toast.LONG);
      }
    } catch (err) {
      console.log("ERROR AL EJECUTAR" + err);
    } finally {
      opacity.stopAnimation();
      opacity.setValue(1);
      setRunning(false);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={isRunning} style={styles.button}>
      <Animated.View style={{ opacity: isRunning ? opacity : 1 }}>
        <MaterialCommunityIcons name={action.icon} size={30} color={"white"} />
        <Text style={styles.buttonText}>{action.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
  },
});

export default DeviceActionButton;
