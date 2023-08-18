import React, { useEffect } from "react";

import { useFeature } from "@/hooks/internal/useFeature";
import { useAuthValues } from "@/hooks/internal/useAuthValues";

import { dfnsDateFormat, dfnsTimeFormat } from "@/i18next-config";
import { momentToDateFnsFormat } from "@/schemas/user";

import { setLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS, APP_DEFAULTS } from "@/utils/constants";

export function HiddenFeatureSetter() {
  const auth = useAuthValues();

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

  return null;
}
