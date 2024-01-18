import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "@/hooks/internal/useLocalStorage";
import { useMediaQuery } from "@/hooks/internal/useMediaQuery";
import { useUpdateEffect } from "@/hooks/internal/useUpdateEffect";

import { APP_DEFAULTS, APP_STORAGE_KEYS } from "@/utils/constants";
import { setDomClass } from "@/utils/dom";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

type TernaryDarkMode = "system" | "dark" | "light";
interface UseTernaryDarkModeOutput {
  isDarkMode: boolean;
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
  nextToggleTernaryDarkMode: TernaryDarkMode;
}

export function useTernaryDarkMode(): UseTernaryDarkModeOutput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [ternaryDarkMode, setTernaryDarkMode] =
    useLocalStorage<TernaryDarkMode>(
      APP_STORAGE_KEYS.theme,
      APP_DEFAULTS.theme
    );
  const [isDarkMode, setDarkMode] = useState<boolean>(isDarkOS);

  const nextToggleTernaryDarkMode = useMemo(() => {
    const toggleDict: Record<TernaryDarkMode, TernaryDarkMode> = {
      light: "system",
      system: "dark",
      dark: "light",
    };

    return toggleDict[ternaryDarkMode];
  }, [ternaryDarkMode]);

  // Update darkMode if os prefers changes
  useUpdateEffect(() => {
    if (ternaryDarkMode === "system") {
      setDarkMode(isDarkOS);
    }
  }, [isDarkOS]);

  useEffect(() => {
    switch (ternaryDarkMode) {
      case "light":
        setDarkMode(false);
        setDomClass(false, "dark");
        break;
      case "system":
        setDarkMode(isDarkOS);
        setDomClass(isDarkOS, "dark");
        break;
      case "dark":
        setDarkMode(true);
        setDomClass(true, "dark");
        break;
    }
  }, [ternaryDarkMode, isDarkOS]);

  function toggleTernaryDarkMode() {
    const toggleDict: Record<TernaryDarkMode, TernaryDarkMode> = {
      light: "system",
      system: "dark",
      dark: "light",
    };
    setTernaryDarkMode((prevMode) => toggleDict[prevMode]);
  }

  return {
    isDarkMode,
    ternaryDarkMode,
    nextToggleTernaryDarkMode,
    setTernaryDarkMode,
    toggleTernaryDarkMode,
  };
}
