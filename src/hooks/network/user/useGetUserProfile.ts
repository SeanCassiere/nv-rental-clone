import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useTranslation } from "react-i18next";

import { fetchUserProfile } from "@/api/users";
import { UserProfileSchema } from "@/schemas/user";
import { dfnsDateFormat, dfnsTimeFormat } from "@/i18n.config";
import { userQKeys } from "@/utils/query-key";
import { setLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS } from "@/utils/constants";

export function useGetUserProfile() {
  const { i18n } = useTranslation();

  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.me(),
    queryFn: () =>
      fetchUserProfile({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }).then((data) => UserProfileSchema.parse(data)),
    enabled: auth.isAuthenticated,
    onSuccess: (data) => {
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
    },
  });
  return query;
}
