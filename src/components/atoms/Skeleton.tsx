import useTheme from "@/hooks/useTheme";
import type { ReactNode } from "react";
import React, { useEffect } from "react";
import type { DimensionValue } from "react-native";
import { Animated, Easing } from "react-native";

interface SkeletonProps {
  isLoading: boolean;
  children: ReactNode;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

function Skeleton({ isLoading, children, width, height, borderRadius = 4 }: SkeletonProps): ReactNode {
  const theme = useTheme();
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [isLoading, animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <>
      {isLoading ? (
        <Animated.View
          style={{
            width: width ?? "auto",
            height: height ?? "100%",
            borderRadius,
            opacity,
            backgroundColor: theme.color.gray,
          }}
        />
      ) : (
        children
      )}
    </>
  );
}

export default Skeleton;
