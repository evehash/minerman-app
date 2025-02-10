import Icon from "@/components/atoms/Icon";
import type { ReactElement } from "react";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface AnimatedFanIconProps {
  size: number;
  color: string;
}

function AnimatedFanIcon({ size, color }: AnimatedFanIconProps): ReactElement {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const startRotation = (): void => {
    const randomDelay = Math.floor(Math.random() * 2000);

    Animated.sequence([
      Animated.delay(randomDelay),
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ),
    ]).start();
  };

  useEffect(() => {
    startRotation();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Icon name="fan" size={size} color={color} />
    </Animated.View>
  );
}

export default AnimatedFanIcon;
