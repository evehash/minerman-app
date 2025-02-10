import { Section } from "@/components/molecules/Section";
import useSettings from "@/hooks/useSettings";
import i18n from "@/i18n";
import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import SettingPanel from "./SettingsPanel";

function SettingsScreen(): ReactElement {
  const { settings } = useSettings();

  return (
    <View style={styles.container}>
      <Section name="Display">
        <SettingPanel
          icon={"theme-light-dark"}
          label={i18n.t("theme")}
          value={i18n.t(`theme#${settings.themeStyle}`)}
          path="/settings/theme"
        />
        <SettingPanel
          icon={"translate"}
          label={i18n.t("language")}
          value={i18n.t(`language#${settings.language}`)}
          path="/settings/language"
        />
      </Section>
      <Section name="Formats">
        <SettingPanel
          icon={"thermometer"}
          label={i18n.t("temperature-unit")}
          value={i18n.t(`temperature-unit#${settings.temperatureUnit}`)}
          path="/settings/temperature-unit"
        />
      </Section>
      <Section name="Network">
        <SettingPanel
          icon={"bitcoin"}
          label={i18n.t("bitcoin-node")}
          value={settings.bitcoinRpcUrl?.length > 0 ? removeProtocol(settings.bitcoinRpcUrl) : i18n.t("not-set")}
          path="/settings/bitcoin-node"
        />
      </Section>
    </View>
  );
}

function removeProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
  },
});

export default SettingsScreen;
