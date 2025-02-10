import SelectableList from "@/components/molecules/SelectableList";
import useSettings from "@/hooks/useSettings";
import i18n from "@/i18n";
import type { ReactElement } from "react";

const options = [
  { value: "celsius", text: i18n.t("temperature-unit#celsius") },
  { value: "fahrenheit", text: i18n.t("temperature-unit#fahrenheit") },
];

function TemperatureUnitScreen(): ReactElement {
  const { settings, updateSetting } = useSettings();

  const handleOnChange = (value): void => updateSetting("temperatureUnit", value);

  return (
    <SelectableList
      defaultValue={settings.temperatureUnit}
      legend={i18n.t("choose-temperature-format")}
      options={options}
      onChange={handleOnChange}
    />
  );
}

export default TemperatureUnitScreen;
