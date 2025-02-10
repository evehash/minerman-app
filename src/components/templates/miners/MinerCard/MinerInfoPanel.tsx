/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
import Icon from "@/components/atoms/Icon";
import Skeleton from "@/components/atoms/Skeleton";
import AnimatedFanIcon from "@/components/templates/miners/MinerCard/AnimatedFanIcon";
import useSettings from "@/hooks/useSettings";
import useTheme from "@/hooks/useTheme";
import type { MinerError, MinerInfo } from "@/services/minerService";
import { formatEfficiency, formatHashRate, formatPercentage, formatPower, formatTemperature } from "@/utils/format";
import { calculateEfficiency, calculateShareSuccessPercentage } from "@/utils/metric";
import type { ReactElement } from "react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MinerInfoPanelProps {
  isLoading: boolean;
  data: MinerInfo | null;
  error: MinerError | null;
}

function MinerInfoPanel({ isLoading, data, error }: MinerInfoPanelProps): ReactElement {
  const theme = useTheme();
  const { settings } = useSettings();
  const isSkeletonVisible = isLoading && data === null;

  const power = data?.power ?? 0;
  const hashRate = data?.hashRate ?? 0;
  const efficiency = calculateEfficiency(power, hashRate);
  const shareSuccess = calculateShareSuccessPercentage(data?.shares ?? { accepted: 0, rejected: 0 });
  const temperature = data?.temperature ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Skeleton isLoading={isSkeletonVisible} width={"70%"} height={24}>
          <View style={styles.label}>
            {error !== null ? (
              <Icon name={"alert-outline"} size={24} color={theme.primaryColor} />
            ) : (
              <AnimatedFanIcon size={24} color={theme.primaryColor} />
            )}
            <Text style={[styles.primaryText, { fontFamily: theme.semiBoldFontFamily, color: theme.primaryColor }]}>
              {data?.name}
            </Text>
          </View>
        </Skeleton>
        <Skeleton isLoading={isSkeletonVisible} width={"20%"} height={24}>
          <View style={styles.label}>
            <Text style={[styles.primaryText, { fontFamily: theme.semiBoldFontFamily, color: theme.primaryColor }]}>
              {formatHashRate(hashRate)}
            </Text>
          </View>
        </Skeleton>
      </View>

      <View style={styles.row}>
        <Skeleton isLoading={isSkeletonVisible} width={"20%"} height={24}>
          <View style={styles.label}>
            <Icon name="lightning-bolt" size={24} color={theme.secondaryColor} />
            <Text style={[styles.secondaryText, { color: theme.secondaryColor }]}>{formatPower(power)}</Text>
          </View>
        </Skeleton>
        <Skeleton isLoading={isSkeletonVisible} width={"20%"} height={24}>
          <View style={styles.label}>
            <Icon name="thermometer" size={24} color={theme.secondaryColor} />
            <Text style={[styles.secondaryText, { color: theme.secondaryColor }]}>
              {formatTemperature(temperature, settings.temperatureUnit)}
            </Text>
          </View>
        </Skeleton>
        <Skeleton isLoading={isSkeletonVisible} width={"20%"} height={24}>
          <View style={styles.label}>
            <Icon name="handshake" size={24} color={theme.secondaryColor} />
            <Text style={[styles.secondaryText, { color: theme.secondaryColor }]}>
              {formatPercentage(shareSuccess)}
            </Text>
          </View>
        </Skeleton>
        <Skeleton isLoading={isSkeletonVisible} width={"20%"} height={24}>
          <View style={styles.label}>
            <Icon name="cogs" size={24} color={theme.secondaryColor} />
            <Text style={[styles.secondaryText, { color: theme.secondaryColor }]}>{formatEfficiency(efficiency)}</Text>
          </View>
        </Skeleton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    alignItems: "center",
    flexDirection: "row",
  },
  primaryText: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 14,
  },
});

export default MinerInfoPanel;
