import useSwarm from "@/hooks/useSwarm";
//import useTheme from "@/hooks/useTheme";
import useInterval from "@/hooks/useInterval";
import { formatHashRate, formatPercentage, formatPower } from "@/utils/format";
import { calculateShareSuccessPercentage } from "@/utils/metric";
import type { ReactElement } from "react";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import BlockMetric from "./BlockMetric";
import SwarmMetric from "./SwarmMetric";
import { createService } from "@/services/nodeService";

/**
 * URL="http://172.18.0.3:8332"
 * USER="bitcoinfees:bitcoinfees"
 */
function getBlockSubsidy(height: number): number {
  const initialSubsidy = 50 * 1e8; // 50 BTC en satoshis
  const halvings = Math.floor(height / 210000);
  return Math.floor(initialSubsidy / Math.pow(2, halvings));
}

const node = createService({ url: "http://192.168.10.2:8333", user: "bitcoinfees", password: "bitcoinfees" });

function SwarmSummary(): ReactElement {
  //const { theme } = useTheme();
  const { swarm } = useSwarm();
  const shareSuccessPercentage = calculateShareSuccessPercentage(swarm.shares);
  const [blockHeight, setBlockHeight] = useState<number>(0);
  const [hashRate, setHashRate] = useState<number>(0);
  const [totalFee, setTotalFee] = useState<number>(0);
  const nextBlockSubsidy = getBlockSubsidy(blockHeight + 1);
  const nextBlockPotentialReward = nextBlockSubsidy + totalFee;
  const potentialRewardBtc = nextBlockPotentialReward / 1e8;

  useInterval(
    () => {
      (async (): Promise<void> => {
        let response = await node.getBlockHeight();

        if (response.success) {
          const blockHeight = response.data;
          setBlockHeight(blockHeight);
          response = await node.getBlockStatsTotalFee(blockHeight);
          if (response.success) setTotalFee(response.data);
        }

        response = await node.getNetworkHashrate();
        if (response.success) setHashRate(response.data / 1e9);
      })();
    },
    30000,
    true,
  );

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <SwarmMetric
          title="Potential reward"
          value={potentialRewardBtc.toFixed(4) + " ₿"}
          //value={potentialRewardBtc.toFixed(4) + " BTC"}
          iconName="gold"
          iconColor="orange"
        />
        <SwarmMetric
          title="Total power"
          value={formatPower(swarm.power)}
          iconName="home-lightning-bolt-outline"
          iconColor="orange"
        />
      </View>
      <View style={styles.column}>
        <SwarmMetric title="Network hash rate" value={formatHashRate(hashRate)} iconName="web" iconColor={"red"} />
        <SwarmMetric
          title="Total hash rate"
          value={formatHashRate(swarm.hashRate)}
          iconName="memory"
          iconColor={"#6495ED"}
        />
      </View>
      <View style={styles.column}>
        <BlockMetric
          title={"Block height"}
          value={blockHeight.toString()}
          iconName={"cube-outline"}
          iconColor={"pink"}
        />
        <SwarmMetric
          title="Share success"
          value={formatPercentage(shareSuccessPercentage)}
          iconName="handshake"
          iconColor={"#3CB371"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
    gap: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
  },
});

export default SwarmSummary;
