import type { IconName } from "@/components/atoms/Icon";
import Icon from "@/components/atoms/Icon";
import Label from "@/components/atoms/Label";
import TextValue from "@/components/atoms/TextValue";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import type { ReactElement } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SettingPanelProps {
  icon: IconName;
  label: string;
  value: string;
  path: string;
}

function SettingPanel({ icon, label, value, path }: SettingPanelProps): ReactElement {
  const theme = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push(path)}>
      <View style={styles.icon}>
        <Icon name={icon} color={theme.secondaryColor} size={24} />
      </View>
      <View>
        <Label>{label}</Label>
        <TextValue>{value}</TextValue>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 20,
  },
  icon: {
    width: 40,
  },
});

export default SettingPanel;
