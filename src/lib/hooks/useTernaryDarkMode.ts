import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useUpdateEffect } from "@/lib/hooks/useUpdateEffect";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

function setDomClass(shouldSetValue: boolean, className: string) {
  if (shouldSetValue) {
    document.documentElement.classList.add(className);
  } else {
    document.documentElement.classList.remove(className);
  }
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

type TernaryDarkMode = "system" | "dark" | "light";
interface UseTernaryDarkModeOutput {
  isDarkMode: boolean;
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
}

export function useTernaryDarkMode(): UseTernaryDarkModeOutput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [ternaryDarkMode, setTernaryDarkMode] =
    useLocalStorage<TernaryDarkMode>(
      STORAGE_KEYS.theme,
      STORAGE_DEFAULTS.theme
    );
  const [isDarkMode, setDarkMode] = useState<boolean>(isDarkOS);

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
    setTernaryDarkMode,
    toggleTernaryDarkMode,
  };
}
