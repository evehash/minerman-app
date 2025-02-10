import SelectableList from "@/components/molecules/SelectableList";
import useSettings from "@/hooks/useSettings";
import i18n from "@/i18n";
import type { ReactElement } from "react";

const options = [
  { value: "system-default", text: i18n.t("language#system-default") },
  { value: "en", text: i18n.t("language#en") },
  { value: "es", text: i18n.t("language#es") },
  { value: "fr", text: i18n.t("language#fr") },
];

function LanguageScreen(): ReactElement {
  const { settings, updateSetting } = useSettings();

  const handleOnChange = (value): void => updateSetting("language", value);

  return (
    <SelectableList
      defaultValue={settings.language}
      legend={i18n.t("choose-application-language")}
      options={options}
      onChange={handleOnChange}
    />
  );
}

export default LanguageScreen;
