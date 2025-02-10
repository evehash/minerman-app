/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/sort-styles */
import useMiners from "@/hooks/useMiners";
import type { Miner } from "@/stores/minersSlice";
import { reorderDevice } from "@/stores/minersSlice";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import IconLabelButton from "./IconLabelButton";

export interface PositionProps {
  index: number;
  total: number;
}

interface MinerEditPanelProps {
  miner: Miner;
  position: PositionProps;
  isVisible: boolean;
}

function MinerEditPanel({ miner, position, isVisible }: MinerEditPanelProps): ReactElement {
  const isFirstCard = position.index === 0;
  const isLastCard = position.index === position.total - 1;

  const [animation] = useState(new Animated.Value(0)); // Inicializamos la animación en 0

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isVisible ? 1 : 0, // Al final de la animación, la anchura será del 60%
      useNativeDriver: false, // Usamos false ya que modificamos 'width' y 'left'
    }).start();
  }, [isVisible]);

  // Calcular el valor de 'width' y 'left' basado en la animación
  const widthInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "60%"], // De 0% a 60% de la anchura del padre
  });
  console.log("111");
  const leftInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "0%"], // Empuja el componente desde la izquierda
  });

  const dispatch = useDispatch();
  const { deleteMiner } = useMiners();

  const handleMoveCardUp = (): void => {
    const { index } = position;
    dispatch(reorderDevice({ fromIndex: index, toIndex: index - 1 }));
  };

  const handleMoveCardDown = (): void => {
    const { index } = position;
    dispatch(reorderDevice({ fromIndex: index, toIndex: index + 1 }));
  };

  const handleDeleteMiner = (): void => deleteMiner(miner); // ADD DELETE BY INDEX
  //
  return (
    <Animated.View style={[styles.overlay, { width: widthInterpolated, right: leftInterpolated }]}>
      {!isFirstCard && <IconLabelButton icon="arrow-up" label="Move up" iconSize={24} onPress={handleMoveCardUp} />}
      {!isLastCard && (
        <IconLabelButton icon="arrow-down" label="Move down" iconSize={24} onPress={handleMoveCardDown} />
      )}
      <IconLabelButton icon="trash-can-outline" label="Delete" iconSize={24} onPress={handleDeleteMiner} />
    </Animated.View>
  );
}
// Aplicamos la animación a 'width' y 'left'
const styles = StyleSheet.create({
  overlay: {
    position: "absolute", // Necesario para mover el componente
    top: 0,
    right: 100,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    flexDirection: "row", // F
    gap: 20,
  },
  overlay2: {
    position: "absolute", // Hace que flote sobre los demás elementos
    top: 0,
    //left: 0,
    right: 0,
    bottom: 0, // Ocupa todo el padre
    justifyContent: "center", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    flexDirection: "row", // F
    gap: 20,
    borderRadius: 10,
    width: "60%",
    // gapondo semi-translúcido para la superposición
  },
  edition: {
    // position: "absolute",
    //top: 0,
    // eslint-disable-next-line react-native/sort-styles
    //right: 0, // Alineado a la derecha
    flexDirection: "row", // Botones alineados horizontalmente
    padding: 10,
    gap: 10,
    //backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo translúcido para destacar los botones
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default MinerEditPanel;
