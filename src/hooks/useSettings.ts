import type { SettingsState } from "@/stores/settingsSlice";
import { updateSetting } from "@/stores/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../stores";

const settingsSelector = (state: RootState): SettingsState => state.settings;

interface UseSettingsReturn {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

function useSettings(): UseSettingsReturn {
  const dispatch = useDispatch();

  const settings = useSelector(settingsSelector);

  return {
    settings,
    updateSetting: (key, value) => dispatch(updateSetting({ key, value })),
  };
}

export default useSettings;
