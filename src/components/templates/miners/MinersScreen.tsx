import MinerCard from "@/components/templates/miners/MinerCard";
import SwarmSummary from "@/components/templates/miners/SwarmSummary";
import useMiners from "@/hooks/useMiners";
import useTheme from "@/hooks/useTheme";
import useToggle from "@/hooks/useToggle";
import type { Miner } from "@/stores/minersSlice";
import type { ReactElement } from "react";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";

function MinersScreen(): ReactElement {
  const theme = useTheme();
  const { miners } = useMiners();

  const [isEditing, toggleEditing] = useToggle(false);

  const renderMiner: ListRenderItem<Miner> = ({ item, index }) => (
    <MinerCard
      key={item.ip}
      miner={item}
      edition={{ isEditing, toggleEditing }}
      position={{ index, total: miners.length }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <SwarmSummary />
      <FlatList data={miners} renderItem={renderMiner} contentContainerStyle={styles.listContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  listContainer: {
    gap: 10,
    padding: 10,
  },
});

export default MinersScreen;
