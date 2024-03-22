import { Dispatch, SetStateAction, useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

function setDomThemeDataAttribute(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
}

type TernaryDarkMode = "system" | "dark" | "light";
interface UseTernaryDarkModeOutput {
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
}

export function useTernaryDarkMode(): UseTernaryDarkModeOutput {
  const [ternaryDarkMode, setTernaryDarkMode] =
    useLocalStorage<TernaryDarkMode>(
      STORAGE_KEYS.theme,
      STORAGE_DEFAULTS.theme
    );

  useEffect(() => {
    setDomThemeDataAttribute(ternaryDarkMode);
  }, [ternaryDarkMode]);

  function toggleTernaryDarkMode() {
    const toggleDict: Record<TernaryDarkMode, TernaryDarkMode> = {
      light: "system",
      system: "dark",
      dark: "light",
    };
    setTernaryDarkMode((prevMode) => toggleDict[prevMode]);
  }

  return {
    ternaryDarkMode,
    setTernaryDarkMode,
    toggleTernaryDarkMode,
  };
}
