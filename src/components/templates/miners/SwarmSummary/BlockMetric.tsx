/* eslint-disable react-native/no-color-literals */
import type { IconName } from "@/components/atoms/Icon";
import Icon from "@/components/atoms/Icon";
import type { ReactElement } from "react";
import { useRef, useEffect } from "react";
import { Animated, View, Text } from "react-native";

interface MetricProps {
  title: string;
  value: string;
  iconName: IconName;
  iconColor: string;
}

function BlockMetric({ iconName, iconColor, title, value }: MetricProps): ReactElement {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startHammerAnimation = (): void => {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -5,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        // Animated.timing(shakeAnim, {
        //   toValue: 0,
        //   duration: 500,
        //   useNativeDriver: true,
        // }),
      ]).start(() => startHammerAnimation()); // Repetir la animación
    };

    startHammerAnimation();
  }, [shakeAnim]);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: shakeAnim,
            },
          ],
        }}
      >
        <Icon name={iconName} size={25} color={iconColor ?? "orange"} />
      </Animated.View>
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <Text style={{ color: "gray", fontSize: 10 }}>{title}</Text>
        <Text style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>{value}</Text>
      </View>
    </View>
  );
}

export default BlockMetric;
