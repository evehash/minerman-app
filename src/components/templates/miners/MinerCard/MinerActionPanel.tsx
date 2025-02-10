import useGetMinerActions from "@/hooks/useGetDeviceActions";
import type { Miner } from "@/stores/minersSlice";
import { useRouter } from "expo-router";
import type { ReactElement } from "react";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import IconLabelButton from "./IconLabelButton";
import MinerActionButton from "./MinerActionButton";

interface MinerActionPanelProps {
  miner: Miner;
  isExpanded: boolean;
}

function MinerActionPanel({ miner, isExpanded }: MinerActionPanelProps): ReactElement {
  const maxHeight = useRef(new Animated.Value(0)).current;

  const { actions /*, updateActions, isLoading, error */ } = useGetMinerActions(miner);
  const router = useRouter();

  const handleOnPressInfo = (): void =>
    router.push({
      pathname: "/view-device",
      params: miner,
    });

  useEffect(() => {
    Animated.timing(maxHeight, {
      toValue: isExpanded ? 100 : 0,
      duration: isExpanded ? 400 : 200,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <Animated.View style={{ maxHeight }}>
      <View style={styles.container}>
        {actions.map((action, index) => (
          <MinerActionButton key={index} action={action} />
        ))}
        <IconLabelButton icon={"information-outline"} label={"Info"} onPress={handleOnPressInfo} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 10,
    overflow: "hidden",
  },
});

export default MinerActionPanel;
