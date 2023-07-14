import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { fetchDashboardMessagesList } from "@/api/dashboard";
import { dashboardQKeys } from "@/utils/query-key";
import { getLocalStorageForUser } from "@/utils/user-local-storage";
import { USER_STORAGE_KEYS } from "@/utils/constants";
import { tryParseJson } from "@/utils/parse";

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

export async function fetchDashboardMessagesListModded(
  opts: Parameters<typeof fetchDashboardMessagesList>[0]
) {
  return await fetchDashboardMessagesList(opts)
    .then((res) => {
      const local = getLocalStorageForUser(
        opts.clientId,
        opts.userId,
        USER_STORAGE_KEYS.dismissedMessages
      );
      const dismissedMessageIds = tryParseJson<string[]>(local, []);

      const messages = res.filter((msg) => {
        if (!dismissedMessageIds.includes(msg.messageId)) {
          return msg;
        }
        return false;
      });

      return messages;
    })
    .catch((e) => {
      console.error(e);
      throw e;
    });
}
