import Button from "@/components/atoms/Button";
import IpAddressInputPad from "@/components/templates/add-miner/IpAddressInputPad";
import useMiners from "@/hooks/useMiners";
import useTheme from "@/hooks/useTheme";
import i18n from "@/i18n";
import getMinerService from "@/services/minerService";
import type { Miner, MinerAdapter } from "@/stores/minersSlice";
import { getNetworkPrefix } from "@/utils/network";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-simple-toast";

function SetIpStepPanel(): ReactElement {
  const theme = useTheme();
  const router = useRouter();
  const { adapter } = useLocalSearchParams<{ adapter: MinerAdapter }>();
  const [ip, setIp] = useState<string>("");
  //const [isConnected, setConnected] = useState(false);
  const [isConnecting, setConnecting] = useState(false);
  const { miners, createMiner } = useMiners();

  const isIpAlreadyUsed = miners.some((m) => m.ip === ip);

  useEffect(() => {
    getNetworkPrefix().then((getNetworkPartOfIp: string | null) => {
      if (getNetworkPartOfIp !== null) {
        setIp(getNetworkPartOfIp + ".");
      }
    });
  }, []);

  const connectDevice = async (): Promise<void> => {
    if (ip === undefined || adapter === undefined) return;
    setConnecting(true);

    try {
      const minerService = getMinerService({ ip, adapter });
      const response = await minerService.getInfo();

      if (response.success) {
        const miner: Miner = { ip, adapter };
        createMiner(miner);
        Toast.show("Connection success", Toast.SHORT);
        router.dismissTo("/");
      } else {
        Toast.show(response.error.message, Toast.LONG);
      }
    } catch (error: unknown) {
      console.error(`Connecting device Unexpected error: ${JSON.stringify(error)}`);
      Toast.show("Error desconocido durante la conexión ", Toast.LONG);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.description, { fontFamily: theme.fontFamily.regular, color: theme.secondaryColor }]}>
          {i18n.t("enter-ip-adress")}
        </Text>
        <View style={styles.textInput}>
          <Text style={[styles.textInput2, { fontFamily: theme.fontFamily.regular, color: theme.primaryColor }]}>
            {ip}
          </Text>
          {isIpAlreadyUsed && <Text>{i18n.t("miner-ip-is-already-used")}</Text>}
        </View>
        <IpAddressInputPad value={ip} onChange={setIp} />
      </View>
      <View style={styles.footer}>
        {isConnecting ? (
          <Button style={{ flex: 1 }} disabled={true} text={"Connecting"} />
        ) : (
          <Button style={{ flex: 1 }} disabled={isIpAlreadyUsed} onPress={connectDevice} text={"Connect"} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  close: {
    paddingLeft: 50,
  },
  container: {
    //alignItems: "center",
    flexDirection: "column",
    marginBottom: 15,
    marginHorizontal: 10,
  },

  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  error: {
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    padding: 5,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",

    gap: 10,
    justifyContent: "space-between",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    borderTopColor: "yellow",
    borderTopWidth: 1,
  },
  modal: {
    //alignSelf: "flex-end",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: "auto",
    padding: 20,
    width: "100%",
  },
  // eslint-disable-next-line react-native/no-color-literals
  textInput: {
    display: "flex",
    margin: "auto",
    width: "50%",
  },
  textInput2: {
    fontSize: 30,
  },
});

export default SetIpStepPanel;
