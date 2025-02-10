/* eslint-disable react-native/no-color-literals */
import type { DeviceAction } from "@/services/deviceService";
import type { ReactNode as ReactElement } from "react";
import React, { useState } from "react";
import { Animated } from "react-native";
import Toast from "react-native-simple-toast";
import IconLabelButton from "./IconLabelButton";

interface MinerActionButtonProps {
  action: DeviceAction;
}

function MinerActionButton({ action }: MinerActionButtonProps): ReactElement {
  const [isRunning, setRunning] = useState(false);
  const opacity = useState(new Animated.Value(1))[0];

  const handleOnPress = async (): Promise<void> => {
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
    <Animated.View style={{ opacity: isRunning ? opacity : 1 }}>
      <IconLabelButton icon={action.icon} label={action.label} onPress={handleOnPress} disabled={isRunning} />
    </Animated.View>
  );
}

export default MinerActionButton;
