import * as React from "react";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

function setDomThemeDataAttribute(theme: string) {
  if (typeof document === "undefined") return;
  if ("startViewTransition" in document) {
    document.startViewTransition(() => {
      document.documentElement.setAttribute("data-theme", theme);
    });
    return;
  }
  (document as Document).documentElement.setAttribute("data-theme", theme);
}

type TernaryDarkMode = "system" | "dark" | "light";
interface UseTernaryDarkModeOutput {
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: React.Dispatch<React.SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
}

export function useTernaryDarkMode(): UseTernaryDarkModeOutput {
  const [ternaryDarkMode, setTernaryDarkMode] =
    useLocalStorage<TernaryDarkMode>(
      STORAGE_KEYS.theme,
      STORAGE_DEFAULTS.theme
    );

  React.useEffect(() => {
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
