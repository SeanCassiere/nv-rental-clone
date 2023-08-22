import React from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { UserProfileSchema } from "@/schemas/user";

import { USER_STORAGE_KEYS } from "@/utils/constants";
import { userQKeys } from "@/utils/query-key";
import {
  getLocalStorageForUser,
  setLocalStorageForUser,
} from "@/utils/user-local-storage";

import { apiClient } from "@/api";
import { dfnsDateFormat, dfnsTimeFormat } from "@/i18next-config";

type UseGetUserProfileOptions = Pick<UseQueryOptions, "suspense">;

export function useGetUserProfile(useQueryOptions?: UseGetUserProfileOptions) {
  const queryOptions = useQueryOptions || {};
  const { i18n } = useTranslation();

  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.me(),
    queryFn: () =>
      apiClient
        .getUserProfileById({
          params: {
            userId: auth.user?.profile.navotar_userid || "",
          },
          query: {
            clientId: auth.user?.profile.navotar_clientid || "",
            userId: auth.user?.profile.navotar_userid || "",
            currentUserId: auth.user?.profile.navotar_userid || "",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            res.body = UserProfileSchema.parse(res.body);
          }
          return res;
        }),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...queryOptions,
  });

  React.useEffect(() => {
    if (query.status !== "success") return;
    if (!query.data || query.data.status !== 200) return;
    const data = query.data.body;

    if (data?.language && i18n.language !== data.language) {
      i18n.changeLanguage(data.language);
    }

    if (
      auth.user?.profile.navotar_clientid &&
      auth.user?.profile.navotar_userid
    ) {
      const clientId = auth.user?.profile.navotar_clientid;
      const userId = auth.user?.profile.navotar_userid;

      const existingDateFormat = getLocalStorageForUser(
        clientId,
        userId,
        USER_STORAGE_KEYS.dateFormat
      );
      if (!existingDateFormat) {
        setLocalStorageForUser(
          clientId,
          userId,
          USER_STORAGE_KEYS.dateFormat,
          data?.overrideDateFormat || dfnsDateFormat
        );
      }

      const existingTimeFormat = getLocalStorageForUser(
        clientId,
        userId,
        USER_STORAGE_KEYS.timeFormat
      );
      if (!existingTimeFormat) {
        setLocalStorageForUser(
          clientId,
          userId,
          USER_STORAGE_KEYS.timeFormat,
          data?.overrideTimeFormat || dfnsTimeFormat
        );
      }
    }
  }, [
    auth.user?.profile.navotar_clientid,
    auth.user?.profile.navotar_userid,
    i18n,
    query.data,
    query.status,
  ]);
  return query;
}
