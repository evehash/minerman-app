import type { Theme } from "@/contexts/ThemeContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

function useTheme(): Theme {
  const { theme } = useContext(ThemeContext);
  return theme;
}

export default useTheme;
