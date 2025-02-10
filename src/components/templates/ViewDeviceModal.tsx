import type { DeviceAttribute } from "@/hooks/useGetDeviceDetails";
import { useGetDeviceDetails } from "@/hooks/useGetDeviceDetails";
import useSettings from "@/hooks/useSettings";

import { Miner } from "@/stores/minersSlice";
import {
  formatAmps,
  formatBinary,
  formatBytes,
  formatFrequency,
  formatHashRate,
  formatPower,
  formatTemperature,
  formatUptime,
  formatVolts,
} from "@/utils/format";
import { useLocalSearchParams } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Label from "../atoms/Label";
import TextValue from "../atoms/TextValue";
import { Section } from "../molecules/Section";

// type DetailsScreenParams = {
//   device: string;
// };

function formatStratumUser(address: string): string {
  const [baseAddress, extra] = address.split(".", 2);

  const formattedAddress = `${baseAddress.slice(0, 6)}...${baseAddress.slice(-6)}`;

  return extra ? `${formattedAddress}.${extra}` : formattedAddress;
}

function ViewDeviceModal(): ReactElement {
  //const { theme } = useTheme();
  const { ip, adapter } = useLocalSearchParams<Miner>();
  const { details, isLoading, error } = useGetDeviceDetails({ ip, type });
  const { settings } = useSettings();

  const formatValue = ({ type, value }: DeviceAttribute): string | number | null => {
    if (typeof value === "undefined" || value === null) return null;
    if (type === "literal") return value;
    if (type === "binary") return formatBinary(value);
    if (type === "seconds") return formatUptime(value);
    if (type === "hash-rate") return formatHashRate(value);
    if (type === "celsius") return formatTemperature(value, settings.temperatureUnit);
    if (type === "watts") return formatPower(value);
    if (type === "amps") return formatAmps(value);
    if (type === "volts") return formatVolts(value);
    if (type === "mhz") return formatFrequency(value);
    if (type === "rpm") return `${value} RPM`;
    if (type === "bytes") return formatBytes(value);
    if (type === "stratum-user") return formatStratumUser(value);
    return null;
  };

  const renderAttribute = (attribute, index): ReactNode | null => {
    const value = formatValue(attribute);
    return value !== null ? (
      <View key={index} style={styles.attribute}>
        <Label>{attribute.name}</Label>
        <TextValue>{value}</TextValue>
      </View>
    ) : null;
  };

  const renderGroup = ({ name, attributes }, index): ReactElement => {
    return (
      <Section key={index} name={name}>
        {attributes.map(renderAttribute)}
      </Section>
    );
  };

  return (
    <ScrollView style={styles.container} showsHorizontalScrollIndicator={false}>
      {isLoading && <Text>Loading...</Text>}
      {error != null && <Text>{error}</Text>}
      {!isLoading && details?.attributeGroups.map(renderGroup)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  attribute: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
});

export default ViewDeviceModal;
