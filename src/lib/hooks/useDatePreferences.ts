import React from "react";

import { STORAGE_KEYS } from "@/lib/utils/constants";

import { dfnsDateFormat, dfnsTimeFormat } from "@/lib/config/i18next";

import { useLocalStorage } from "./useLocalStorage";

export function useDatePreference() {
  const [dateFormat] = useLocalStorage(STORAGE_KEYS.dateFormat, dfnsDateFormat);
  const [timeFormat] = useLocalStorage(STORAGE_KEYS.timeFormat, dfnsTimeFormat);

  const dateTimeFormat = React.useMemo(
    () => `${dateFormat} ${timeFormat}`,
    [dateFormat, timeFormat]
  );

  return {
    dateFormat,
    timeFormat,
    dateTimeFormat,
  } as const;
}
