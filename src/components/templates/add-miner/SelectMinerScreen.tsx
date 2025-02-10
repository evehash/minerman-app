import Badge from "@/components/atoms/Badge";
import Icon from "@/components/atoms/Icon";
import { Section } from "@/components/molecules/Section";
import useTheme from "@/hooks/useTheme";
import type { MinerAdapter } from "@/stores/minersSlice";
import { useRouter } from "expo-router";
import type { ReactElement } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MinerGroup {
  name: string;
  miners: MinerDescriptor[];
}

interface MinerDescriptor {
  name: string;
  models: string[];
  adapter: MinerAdapter;
  targetVersion: string;
}

const minerGroup: MinerGroup[] = [
  {
    name: "ESP miner",
    miners: [
      {
        name: "Bitaxe",
        models: ["ultra", "supra", "gamma"],
        adapter: "esp-miner-2",
        targetVersion: "2.x.x",
      },
      {
        name: "Nerdaxe",
        models: ["ultra", "gamma", "Q+", "OCT"],
        adapter: "esp-miner-2",
        targetVersion: "1.x.x",
      },
      {
        name: "Lucky miner",
        models: ["Lv06"],
        adapter: "esp-miner-2",
        targetVersion: "2.x.x",
      },
    ],
  },
  {
    name: "Avalon home",
    miners: [
      {
        name: "Avalon mini",
        models: ["3"],
        adapter: "avalon-nano-3",
        targetVersion: "2.x.x",
      },
      {
        name: "Avalon nano",
        models: ["3", "3S"],
        adapter: "avalon-nano-3",
        targetVersion: "1.x.x",
      },
    ],
  },
];

function SelectMinerStepPanel(): ReactElement {
  const theme = useTheme();
  const router = useRouter();

  const handleOnPress = (adapter: MinerAdapter): void =>
    router.navigate({ pathname: "/add-miner/connect", params: { adapter } });

  return (
    <View style={styles.container}>
      {minerGroup.map(({ name, miners }, index) => (
        <Section key={index} name={name}>
          {miners.map((miner, index) => (
            <TouchableOpacity key={index} style={styles.button} onPress={() => handleOnPress(miner.adapter)}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={[styles.minerName, { fontFamily: theme.semiBoldFontFamily, color: theme.primaryColor }]}>
                    {miner.name}
                  </Text>
                  {miner.models.map((model, index) => (
                    <Badge key={index} text={model} />
                  ))}
                </View>
                <Text
                  style={{ fontFamily: theme.regularFontFamily, color: theme.secondaryColor }}
                >{`Firmware version: ${miner.targetVersion}`}</Text>
              </View>
              <Icon name={"chevron-right"} color={theme.secondaryColor} size={28} />
            </TouchableOpacity>
          ))}
        </Section>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  minerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SelectMinerStepPanel;
