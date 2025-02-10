import SelectableList from "@/components/molecules/SelectableList";
import useSettings from "@/hooks/useSettings";
import i18n from "@/i18n";
import type { ReactElement } from "react";

const options = [
  { value: "system-default", text: i18n.t("theme#system-default") },
  { value: "light", text: i18n.t("theme#light") },
  { value: "dark", text: i18n.t("theme#dark") },
];

function ThemeScreen(): ReactElement {
  const { settings, updateSetting } = useSettings();

  const handleOnChange = (value): void => updateSetting("themeStyle", value);

  return (
    <SelectableList
      defaultValue={settings.themeStyle}
      legend={i18n.t("choose-temperature-format")}
      options={options}
      onChange={handleOnChange}
    />
  );
}

export default ThemeScreen;
