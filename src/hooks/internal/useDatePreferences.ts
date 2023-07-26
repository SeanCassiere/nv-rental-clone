import { useAuth } from "react-oidc-context";

import { USER_STORAGE_KEYS } from "@/utils/constants";
import { getLocalStorageForUser } from "@/utils/user-local-storage";
import { dfnsDateFormat, dfnsTimeFormat } from "@/i18n.config";

export function useDatePreference() {
  const auth = useAuth();

  const clientId = auth.user?.profile.navotar_clientid;
  const userId = auth.user?.profile.navotar_userid;

  const fromStorageDate =
    clientId && userId
      ? getLocalStorageForUser(clientId, userId, USER_STORAGE_KEYS.dateFormat)
      : null;
  const fromStorageTime =
    clientId && userId
      ? getLocalStorageForUser(clientId, userId, USER_STORAGE_KEYS.timeFormat)
      : null;

  const defaultDateTimeFormat = `${dfnsDateFormat} ${dfnsTimeFormat}`;
  const parsedUserDateTimeFormat = `${fromStorageDate} ${fromStorageTime}`;

  return {
    dateFormat: fromStorageDate || dfnsDateFormat,
    timeFormat: fromStorageTime || dfnsTimeFormat,
    dateTimeFormat:
      fromStorageDate && fromStorageTime
        ? parsedUserDateTimeFormat
        : defaultDateTimeFormat,
  } as const;
}
