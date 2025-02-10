import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface SettingsState {
  temperatureUnit: "celsius" | "fahrenheit";
  themeStyle: "system-default" | "light" | "dark";
  language: "system-default" | "en" | "es" | "fr";
  bitcoinRpcUrl: string;
  bitcoinRpcUser: string;
  bitcoinRpcPassword: string;
}

const initialState: SettingsState = {
  temperatureUnit: "celsius",
  themeStyle: "system-default",
  language: "system-default",
  bitcoinRpcUrl: "",
  bitcoinRpcUser: "",
  bitcoinRpcPassword: "",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    updateSetting<K extends keyof SettingsState>(
      state: SettingsState,
      action: PayloadAction<{ key: K; value: SettingsState[K] }>,
    ) {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;

export type { SettingsState };
