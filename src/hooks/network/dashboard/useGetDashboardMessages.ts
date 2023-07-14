import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchDashboardMessagesList } from "@/api/dashboard";
import { dashboardQKeys } from "@/utils/query-key";
import { getLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS } from "@/utils/constants";

export function useGetDashboardMessages() {
  const auth = useAuth();

  const query = useQuery({
    queryKey: dashboardQKeys.messages(),
    queryFn: async () => {
      return await fetchDashboardMessagesListModded({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      });
    },
    enabled: auth.isAuthenticated,
    initialData: [],
  });
  return query;
}

function tryParseJson<TData>(json: string | null, defaultData: TData): TData {
  if (!json) return defaultData;
  try {
    return JSON.parse(json);
  } catch (e) {
    return defaultData;
  }
}

export async function fetchDashboardMessagesListModded(
  opts: Parameters<typeof fetchDashboardMessagesList>[0]
) {
  return await fetchDashboardMessagesList(opts)
    .then((res) => {
      const local = getLocalStorageForUser(
        opts.clientId,
        opts.userId,
        USER_STORAGE_KEYS.dismissedNotices
      );
      const dismissedNoticeIds = tryParseJson<string[]>(local, []);

      const notices = res.filter((notice) => {
        if (!dismissedNoticeIds.includes(notice.messageId)) {
          return notice;
        }
        return false;
      });

      return notices;
    })
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
