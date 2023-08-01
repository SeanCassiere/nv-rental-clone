import React from "react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";

import { fetchUserProfile } from "@/api/users";
import { UserProfileSchema } from "@/schemas/user";
import { dfnsDateFormat, dfnsTimeFormat } from "@/i18next-config";
import { userQKeys } from "@/utils/query-key";
import { setLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS } from "@/utils/constants";

type UseGetUserProfileOptions = Pick<UseQueryOptions, "suspense">;

export function useGetUserProfile(useQueryOptions?: UseGetUserProfileOptions) {
  const queryOptions = useQueryOptions || {};
  const { i18n } = useTranslation();

  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.me(),
    queryFn: () =>
      fetchUserProfile({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        currentUserId: auth.user?.profile.navotar_userid || "",
      }).then((data) => UserProfileSchema.parse(data)),
    enabled: auth.isAuthenticated,
    staleTime: 1000 * 60 * 1,
    ...queryOptions,
  });

  React.useEffect(() => {
    if (query.status !== "success") return;

    const data = query.data;

    if (data?.language) {
      i18n.changeLanguage(data.language);
    }

    if (
      auth.user?.profile.navotar_clientid &&
      auth.user?.profile.navotar_userid
    ) {
      const clientId = auth.user?.profile.navotar_clientid;
      const userId = auth.user?.profile.navotar_userid;

      setLocalStorageForUser(
        clientId,
        userId,
        USER_STORAGE_KEYS.dateFormat,
        data?.overrideDateFormat || dfnsDateFormat
      );
      setLocalStorageForUser(
        clientId,
        userId,
        USER_STORAGE_KEYS.timeFormat,
        data?.overrideTimeFormat || dfnsTimeFormat
      );
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
