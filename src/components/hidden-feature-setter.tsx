import React, { useEffect } from "react";

import { useFeature } from "@/hooks/internal/useFeature";
import { useAuthValues } from "@/hooks/internal/useAuthValues";

import { dfnsDateFormat, dfnsTimeFormat } from "@/i18next-config";
import { momentToDateFnsFormat } from "@/schemas/user";

import { setLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS, APP_DEFAULTS } from "@/utils/constants";

export function HiddenFeatureSetter() {
  const auth = useAuthValues();

  // Set user's default date format
  const [dateFormatFeature] = useFeature("OVERRIDE_DATE_FORMAT");
  const dateFormat = momentToDateFnsFormat(dateFormatFeature || dfnsDateFormat);
  useEffect(() => {
    setLocalStorageForUser(
      auth.clientId,
      auth.userId,
      USER_STORAGE_KEYS.dateFormat,
      dateFormat
    );
  }, [auth.clientId, auth.userId, dateFormat]);

  // Set user's default time format
  const [timeFormatFeature] = useFeature("OVERRIDE_TIME_FORMAT");
  const timeFormat = momentToDateFnsFormat(timeFormatFeature || dfnsTimeFormat);
  useEffect(() => {
    setLocalStorageForUser(
      auth.clientId,
      auth.userId,
      USER_STORAGE_KEYS.timeFormat,
      timeFormat
    );
  }, [auth.clientId, auth.userId, timeFormat]);

  // Set user's default row count
  const [tableRowCountFeature] = useFeature("DEFAULT_ROW_COUNT");
  const tableRowCount = tableRowCountFeature || APP_DEFAULTS.tableRowCount;
  useEffect(() => {
    setLocalStorageForUser(
      auth.clientId,
      auth.userId,
      USER_STORAGE_KEYS.tableRowCount,
      tableRowCount
    );
  }, [auth.clientId, auth.userId, tableRowCount]);

  // Set user's default currency digits for 3 or 4 decimal places
  const [currencyDigitCount3Feature] = useFeature("G_C_AUTO_BODY_3_DECIMALS");
  const [currencyDigitCount4Feature] = useFeature("G_C_AUTO_BODY_4_DECIMALS");
  useEffect(() => {
    setLocalStorageForUser(
      auth.clientId,
      auth.userId,
      USER_STORAGE_KEYS.currencyDigits,
      currencyDigitCount4Feature
        ? "4"
        : currencyDigitCount3Feature
        ? "3"
        : APP_DEFAULTS.currencyDigits
    );
  }, [
    auth.clientId,
    auth.userId,
    currencyDigitCount3Feature,
    currencyDigitCount4Feature,
  ]);

  return null;
}
