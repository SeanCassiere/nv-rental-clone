import React from "react";

import { useFeature } from "@/lib/hooks/useFeature";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { momentToDateFnsFormat } from "@/lib/schemas/user";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import { dfnsDateFormat, dfnsTimeFormat } from "@/lib/config/i18next";

export function useConfigureLocalFeatures() {
  // Set user's default date format
  const [dateFormatFeature] = useFeature("OVERRIDE_DATE_FORMAT");
  const dateFormat = momentToDateFnsFormat(dateFormatFeature || dfnsDateFormat);
  const [storedDateFormat, setDateFormat] = useLocalStorage(
    STORAGE_KEYS.dateFormat,
    dfnsDateFormat
  );
  React.useEffect(() => {
    if (storedDateFormat !== dateFormat) {
      setDateFormat(dateFormat);
    }
  }, [dateFormat, setDateFormat, storedDateFormat]);

  // Set user's default time format
  const [timeFormatFeature] = useFeature("OVERRIDE_TIME_FORMAT");
  const timeFormat = momentToDateFnsFormat(timeFormatFeature || dfnsTimeFormat);
  const [storedTimeFormat, setTimeFormat] = useLocalStorage(
    STORAGE_KEYS.timeFormat,
    dfnsTimeFormat
  );
  React.useEffect(() => {
    if (storedTimeFormat !== timeFormat) {
      setTimeFormat(timeFormat);
    }
  }, [setTimeFormat, storedTimeFormat, timeFormat]);

  // Set user's default row count
  const [tableRowCountFeature] = useFeature("DEFAULT_ROW_COUNT");
  const [storedTableRowCount, setTableRowCount] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  React.useEffect(() => {
    if (tableRowCountFeature && tableRowCountFeature !== storedTableRowCount) {
      setTableRowCount(tableRowCountFeature);
    }
  }, [setTableRowCount, storedTableRowCount, tableRowCountFeature]);

  // Set user's default currency digits for 3 or 4 decimal places
  const [currencyDigitCount3Feature] = useFeature("G_C_AUTO_BODY_3_DECIMALS");
  const [currencyDigitCount4Feature] = useFeature("G_C_AUTO_BODY_4_DECIMALS");
  const [_, setStoredDigits] = useLocalStorage(
    STORAGE_KEYS.currencyDigits,
    STORAGE_DEFAULTS.currencyDigits
  );
  React.useEffect(() => {
    if (currencyDigitCount4Feature) {
      setStoredDigits("4");
      return;
    }
    if (currencyDigitCount3Feature) {
      setStoredDigits("3");
      return;
    }
  }, [currencyDigitCount3Feature, currencyDigitCount4Feature, setStoredDigits]);

  return null;
}
