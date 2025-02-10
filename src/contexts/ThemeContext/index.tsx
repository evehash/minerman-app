import useSettings from "@/hooks/useSettings";
import type { ReactElement } from "react";
import { createContext } from "react";
import type { ColorSchemeName } from "react-native";
import { useColorScheme } from "react-native";
import darkTheme from "./DarkTheme";
import lightTheme from "./LightTheme";

export interface Theme {
  backgroundColor: string;
  buttonColor: string;
  errorBackgroundColor: string;
  errorPrimaryColor: string;

  levelColor: {
    textColor: string;
    low: [string, string, string, string];
    medium: [string, string, string, string];
    high: [string, string, string, string];
    neutral: [string, string, string, string];
  };
  fontFamily: {
    regular?: string;
    semiBold?: string;
  };
  regularFontFamily: string;
  semiBoldFontFamily: string;
  neutralColor: string;
  primaryColor: string;
  secondaryColor: string;
  shadowColor: string;
  inactiveColor: string;

  successColor: string;
  dangerColor: string;
  surfaceColor: string;

  // NEW STYLES
  statusBarStyle: "light" | "dark";
  statusBarBackgroundColor: string;
  color: {
    green: string;
    orange: string;
    blue: string;
    gray: string;
  };
}

export interface ThemeContextValue {
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
});

interface ThemeContextProviderProps {
  children: (theme: Theme) => ReactElement;
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps): ReactElement {
  const systemColorScheme: ColorSchemeName = useColorScheme();
  const { settings } = useSettings();
  let theme: Theme;

  switch (settings.themeStyle) {
    case "dark":
      theme = darkTheme;
      break;
    case "light":
      theme = lightTheme;
      break;
    case "system-default":
      theme = systemColorScheme === "dark" ? darkTheme : lightTheme;
  }

  return <ThemeContext.Provider value={{ theme }}>{children(theme)}</ThemeContext.Provider>;
}
