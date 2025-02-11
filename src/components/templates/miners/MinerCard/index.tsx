/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
import useGetMinerInfo from "@/hooks/useGetMinerInfo";
import useSwarm from "@/hooks/useSwarm";
import useTheme from "@/hooks/useTheme";
import useToggle from "@/hooks/useToggle";
import type { Miner } from "@/stores/minersSlice";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Asegúrate de tener instalada la librería de iconos
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import type { ReactElement } from "react";
import React, { useEffect } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import MinerActionPanel from "./MinerActionPanel";
import type { PositionProps } from "./MinerEditPanel";
import MinerEditPanel from "./MinerEditPanel";
import MinerInfoPanel from "./MinerInfoPanel";

interface EditionProps {
  editing: boolean;
  toggleEditing(): void;
}

interface MinerCardProps {
  miner: Miner;
  edition: EditionProps;
  position: PositionProps;
}

function MinerCard({ miner, edition, position }: MinerCardProps): ReactElement {
  const theme = useTheme();
  const { updateMiner } = useSwarm();

  const { editing, toggleEditing } = edition;

  const { data, isLoading, error } = useGetMinerInfo({ miner });

  useEffect(() => {
    if (data !== null && !editing) {
      updateMiner({
        ...data,
        ip: miner.ip,
      });
    }
  }, [data]);

  //isEditing ? startWiggling() : stopWiggling();

  const [isExpanded, toggleExpanded] = useToggle(false);

  const handlePress = (): void => {
    impactAsync(ImpactFeedbackStyle.Soft);
    if (editing) {
      toggleEditing();
      return;
    }

    toggleExpanded();
  };

  const handleLongPress = (): void => {
    impactAsync(ImpactFeedbackStyle.Rigid);
    toggleEditing();
  };
  console.log(error);
  return (
    <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress} activeOpacity={1}>
      <Animated.View key={miner.ip} style={[styles.container, { backgroundColor: theme.surfaceColor }]}>
        <View style={styles.row}>
          <MinerInfoPanel isLoading={isLoading} data={data} error={error} />
          <View style={styles.chevron}>
            <MaterialCommunityIcons
              name={error !== null ? "alert-outline" : isExpanded ? "chevron-down" : "chevron-up"}
              size={24}
              color={theme.primaryColor}
            />
          </View>
        </View>
        <MinerActionPanel miner={miner} isExpanded={isExpanded} />
        <MinerEditPanel isVisible={editing} miner={miner} position={position} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    borderRadius: 10,
    //color: "white",
    flexDirection: "column",
    flex: 1,
    //flexDirection: "column",
    //justifyContent: "center",
    //marginBottom: 10,
    //marginHorizontal: 10,
    padding: 10,
    overflow: "hidden", // Asegura que el contenido que sobresalga se oculte
    position: "relative", // N
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  chevron: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    //    marginBottom: 5,
    paddingLeft: 10,
    overflow: "hidden",
  },
  // eslint-disable-next-line react-native/no-color-literals
  edition: {
    // position: "absolute",
    //top: 0,
    // eslint-disable-next-line react-native/sort-styles
    //right: 0, // Alineado a la derecha
    flexDirection: "row", // Botones alineados horizontalmente
    padding: 10,
    //backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo translúcido para destacar los botones
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals, react-native/sort-styles
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default MinerCard;
